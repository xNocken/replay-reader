const NetBitReader = require('./Classes/NetBitReader');
const PlaybackPacket = require('./Classes/PlaybackPacket');
const Replay = require('./Classes/Replay');
const decompress = require('./decompress');
const readExportData = require('./replayData/netExportData');
const readExternalData = require('./replayData/readExternalData');
const readPacket = require('./replayData/readPacket');
const recievedPacket = require('./replayData/recievedPacket');
let packetIndex = 0;

/**
 * Get packets from the replay
 * @param {Replay} replay the replay
 */
const parsePlaybackPackets = (replay, globalData) => {
  let currentLevelIndex;

  if (replay.header.NetworkVersion >= 6) {
    currentLevelIndex = replay.readInt32()
  }

  const timeSeconds = replay.readFloat32();

  if (replay.header.NetworkVersion >= 10) {
    readExportData(replay, globalData);
  }

  if (replay.hasLevelStreamingFixes()) {
    const numStreamingLevels = replay.readIntPacked();

    for (let i = 0; i < numStreamingLevels; i++) {
      const levelName = replay.readString();
    }
  } else {
    throw Error('FTransform deserialize not implemented');
  }

  if (replay.hasLevelStreamingFixes()) {
    const externalOffset = replay.readUInt64();
  }

  readExternalData(replay);

  if (replay.hasLevelStreamingFixes()) {
    const skipExternalOffset = replay.readUInt64();

    if (skipExternalOffset > 0) {
      replay.skip(parseInt(skipExternalOffset, 10));
    }
  }

  const packets = [];
  let done = false;

  while (!done) {
    if (replay.hasLevelStreamingFixes()) {
      replay.readIntPacked();
    }

    const packet = readPacket(replay);

    packet.timeSeconds = timeSeconds;

    packets.push(packet);

    done = packet.state;
  }

  return packets;
};

/**
 * @param {PlaybackPacket} packet
 */
const recievedRawPacket = (packet, replay, globalData) => {
  let lastByte = packet.data[packet.data.length - 1];

  if (lastByte === 0) {
    throw Error('Malformed packet: Received packet with 0\'s in last byte of packet');
  }

  let bitSize = (packet.data.length * 8) - 1;

  while (!((lastByte & 0x80) >= 1)) {
    lastByte *= 2;
    bitSize--;
  }

  const packetArchive = new NetBitReader(packet.data, bitSize);

  packetArchive.header = replay.header;
  packetArchive.info = replay.info;

  try {
    recievedPacket(packetArchive, packet.timeSeconds, globalData);
  } catch (ex) {
    console.log(ex);
  }
};

/**
 * Parse the replayData event
 * @param {Replay} replay the replay
 */
const parseReplayData = async (replay, globalData) => {
  let start;
  let end;
  let length;

  if (replay.info.FileVersion >= 4) {
    start = replay.readUInt32();
    end = replay.readUInt32();
    length = replay.readUInt32();
  } else {
    length = replay.readUInt32();
  }

  let memorySizeInBytes = length;

  if (replay.info.FileVersion >= 6) {
    memorySizeInBytes = replay.readInt32();
  }

  const decrypted = replay.decryptBuffer(length);
  const decompressed = await decompress(decrypted, replay.info.IsCompressed);

  const binaryReplay = new Replay(decompressed);

  binaryReplay.header = replay.header;
  binaryReplay.info = replay.info;

  let index = 0;

  while (binaryReplay.buffer.length > binaryReplay.offset) {
    const playbackPackets = parsePlaybackPackets(binaryReplay, globalData);

    playbackPackets.forEach((packet, index) => {
      if (packet.state === 0) {
        packetIndex++;

        recievedRawPacket(packet, replay, globalData);
      }
    })
  }
}

module.exports = parseReplayData;
