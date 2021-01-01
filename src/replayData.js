const NetBitReader = require('./Classes/NetBitReader');
const PlaybackPacket = require('./Classes/PlaybackPacket');
const Replay = require('./Classes/Replay');
const decompress = require('./decompress');
const readExportData = require('./replayData/netExportData');
const readExternalData = require('./replayData/readExternalData');
const readPacket = require('./replayData/readPacket');
const NetFieldExportGroupMap = {};
const NetFieldExportGroupIndexToGroup = {};
let packetIndex = 0;

/**
 * Get packets from the replay
 * @param {Replay} replay the replay
 */
const parsePlaybackPackets = (replay) => {
  let currentLevelIndex;

  if (replay.header.NetworkVersion >= 6) {
    currentLevelIndex = replay.readInt32()
  }

  const timeSeconds = replay.readFloat32();

  if (replay.header.NetworkVersion >= 10) {
    readExportData(replay);
  }

  if (replay.hasLevelStreamingFixes()) {
    const numStreamingLevels = replay.readIntPacked();

    for (let i = 0; i < numStreamingLevels; i++) {
      const levelName = replay.readString();
    }
  } else {
    const numStreamingLevels = replay.readIntPacked();

    for (let i = 0; i < numStreamingLevels; i++) {
      const pakageName = replay.readString();
      const pakageNameToLoad = replay.readString();

      throw Error('FTransform deserialize not implemented');
    }
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

  while(!done) {
    if (replay.hasLevelStreamingFixes()) {
      replay.readIntPacked();
    }

    const packet = readPacket(replay);

    packets.push(packet);

    done = packet.state;
  }

  return packets;
};

/**
 * @param {PlaybackPacket} packet
 */
const recievedRawPacket = (packet, replay) => {
  const lastByte = packet.data[packet.data.length - 1];

  if (lastByte === 0) {
    throw Error('Malformed packet: Received packet with 0\'s in last byte of packet');
  }

  const bitSize = (packet.data.length * 8) - 1;

  while (!((lastByte & 0x80) >= 1)) {
    lastByte *= 2;
    bitSize--;
  }

  const packetArchive = new NetBitReader(packet.data, bitSize);

  packetArchive.header = replay.header;
  packetArchive.info = replay.info;

  try {
    recievedPacket(packetArchive);
  } catch (ex) {
    console.log(ex);
  }
};

/**
 * Parse the replayData event
 * @param {Replay} replay the replay
 */
const parseReplayData = async (replay) => {
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

  while (binaryReplay.buffer.length > binaryReplay.offset) {
    const playbackPackets = parsePlaybackPackets(binaryReplay);

    playbackPackets.forEach((packet) => {
      if (packet.state === 0) {
        packetIndex++;

        recievedRawPacket(packet, replay);
      }
    })
  }
}

module.exports = parseReplayData;
