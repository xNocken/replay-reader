const PlaybackPacket = require("../Classes/PlaybackPacket");
const Replay = require("../Classes/Replay");
const readExportData = require("./netExportData");
const readExternalData = require("./readExternalData");
const readPacket = require("./readPacket");
const receivedPacket = require("./receivedPacket");

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

  replay.addOffset(2, bitSize);

  try {
    receivedPacket(replay, packet.timeSeconds, globalData);
  } catch (ex) {
    console.log(ex);
  }

  replay.popOffset(2, bitSize);
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
    try {
      globalData.parsingEmitter.emit('nextFrame', {
        timeSeconds,
        sinceLastFrame: globalData.lastFrameTime - timeSeconds,
        globalData,
        result: globalData.result,
        states: globalData.states,
        setFastForward: globalData.setFastForward,
        stopParsing: globalData.stopParsingFunc,
      });
    } catch (err) {
      console.error(`Error while exporting "nextFrame": ${err.stack}`);
    }

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

    replay.addOffsetByte(1, packet.size);

    if (packet.state === 0) {
      receivedRawPacket(packet, replay, globalData);
    } else {
      replay.popOffset(1);

      return;
    }

    replay.popOffset(1);
  }
};

module.exports = parsePlaybackPackets;
