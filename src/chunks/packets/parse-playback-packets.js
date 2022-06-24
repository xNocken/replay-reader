const readExternalData = require("./read-external-data");
const readNetExportGuids = require("./read-net-export-guids");
const readNetFieldExports = require("./read-nfe-group");
const readPacket = require("./read-packet");
const receivedPacket = require("./received-packet");

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

const parsePlaybackPackets = (replay, globalData) => {
  if (replay.header.networkVersion >= 6) {
    replay.skipBytes(4); // current level index
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

  if (replay.header.networkVersion >= 10) {
    readNetFieldExports(replay, globalData);
    readNetExportGuids(replay, globalData);
  }

  if (replay.hasLevelStreamingFixes()) {
    const numStreamingLevels = replay.readIntPacked();

    for (let i = 0; i < numStreamingLevels; i++) {
      replay.readString();
    }
  } else {
    throw Error('FTransform deserialize not implemented');
  }

  if (replay.hasLevelStreamingFixes()) {
    replay.skipBytes(8);
  }

  readExternalData(replay, globalData);

  if (replay.hasGameSpecificFrameData()) {
    const externalOffsetSize = replay.readUInt64();

    if (externalOffsetSize > 0) {
      replay.skipBytes(parseInt(externalOffsetSize, 10));
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
