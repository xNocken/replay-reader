const PlaybackPacket = require('./Classes/PlaybackPacket');
const decompress = require('./decompress');
const readExportData = require('./replayData/netExportData');
const readExternalData = require('./replayData/readExternalData');
const readPacket = require('./replayData/readPacket');
const receivedPacket = require('./replayData/receivedPacket');
const Replay = require('./Classes/Replay');

/**
 * @param {PlaybackPacket} packet
 */
const receivedRawPacket = (packet, replay, globalData) => {
  let lastByte = replay.getLastByte();

  if (!lastByte) {
    throw Error('Malformed packet: Received packet with 0\'s in last byte of packet');
  }

  let bitSize = (packet.size * 8) - 1;

  while (!((lastByte & 0x80) >= 1)) {
    lastByte *= 2;
    bitSize--;
  }

  replay.addOffset(bitSize);

  try {
    receivedPacket(replay, packet.timeSeconds, globalData);
  } catch (ex) {
    console.log(ex);
  }

  replay.popOffset();
};

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

  if (globalData.lastFrameTime !== timeSeconds) {
    globalData.parsingEmitter.emit('nextFrame', {
      timeSeconds,
      sinceLastFrame: globalData.lastFrameTime - timeSeconds,
      globalData,
      result: globalData.result,
      states: globalData.states,
    });

    globalData.lastFrameTime = timeSeconds;
  }

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
    replay.skipBytes(8);
  }

  readExternalData(replay, globalData);

  if (replay.hasGameSpecificFrameData()) {
    const skipExternalOffset = replay.readUInt64();

    if (skipExternalOffset > 0) {
      replay.skipBytes(parseInt(skipExternalOffset, 10));
    }
  }

  let done = false;

  while (!done) {
    const packet = readPacket(replay);

    packet.timeSeconds = timeSeconds;

    replay.addOffsetByte(packet.size);

    if (packet.state === 0) {
      receivedRawPacket(packet, replay, globalData);
    } else {
      replay.popOffset();

      return;
    }

    replay.popOffset();
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

  if (replay.info.FileVersion >= 6) {
    replay.skipBytes(4);
  }

  const decrypted = replay.decryptBuffer(length);
  const binaryReplay = await decompress(decrypted, replay.info.IsCompressed);

  while (!binaryReplay.atEnd()) {
    parsePlaybackPackets(binaryReplay, globalData);
  }

  if (!replay.info.IsEncrypted) {
    replay.popOffset();
  };
}

module.exports = parseReplayData;
