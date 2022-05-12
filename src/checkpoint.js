const NetworkGUID = require('../Classes/NetworkGUID');
const readNetFieldExportGroup = require('./checkpointData/readNetFieldExportGroup');
const decompress = require('./decompress');
const parsePlaybackPackets = require('./replayData/parsePlaybackPackets');
const removePathPrefix = require('./utils/removePathPrefix');

const parseCheckpoint = (replay, data, globalData) => {
  replay.goTo(data.startPos);

  globalData.resetForCheckpoint();

  const decrypted = replay.decryptBuffer(data.sizeInBytes);
  const binaryReplay = decompress(decrypted, replay.info.isCompressed, globalData);

  if (binaryReplay.hasDeltaCheckpoints()) {
    binaryReplay.skipBytes(4); // checkpoint size
  }

  if (binaryReplay.hasLevelStreamingFixes()) {
    binaryReplay.skipBytes(8); // packet offset
  }

  if (binaryReplay.header.networkVersion >= 6) {
    binaryReplay.skipBytes(4); // level for checkpoint
  }

  if (binaryReplay.header.networkVersion >= 8) {
    if (binaryReplay.hasDeltaCheckpoints()) {
      throw new Error('delta checkpoints not implemented');
    }

    binaryReplay.readArray((replay) => replay.readString())
  }

  const guidCount = binaryReplay.readInt32();

  const cacheGuids = [];

  for (let i = 0; i < guidCount; i++) {
    const guid = binaryReplay.readIntPacked();
    const outerGuid = new NetworkGUID();
    outerGuid.value = binaryReplay.readIntPacked();

    const cacheObject = {
      outer: outerGuid,
    }

    if (binaryReplay.header.networkVersion < 15) {
      cacheObject.path = removePathPrefix(binaryReplay.readString());
    } else {
      const isExported = binaryReplay.readByte() === 1;

      if (isExported) {
        cacheObject.path = removePathPrefix(binaryReplay.readString());

        cacheGuids.push(cacheObject);
      } else {
        const pathNameIndex = binaryReplay.readIntPacked();

        if (pathNameIndex < cacheGuids.length) {
          cacheObject.path = cacheGuids[pathNameIndex].path;
        }
      }
    }

    if (binaryReplay.header.networkVersion < 16) {
      cacheObject.checksum = binaryReplay.readUInt32();
    }

    cacheObject.flags = binaryReplay.readByte();

    globalData.netGuidCache.NetGuids[guid] = cacheObject;

    if (globalData.debug) {
      globalData.debugNetGuidToPathName.push({
        path: cacheObject.path,
        value: guid,
        outer: outerGuid.value,
      });
    }
  }

  const groups = [];

  if (binaryReplay.hasDeltaCheckpoints()) {
    throw new Error('Delta checkpoints not implemented');
  } else {
    const netFieldExportCount = binaryReplay.readInt32();

    for (let i = 0; i < netFieldExportCount; i++) {
      groups.push(readNetFieldExportGroup(binaryReplay, globalData));
    }
  }

  parsePlaybackPackets(binaryReplay, globalData);

  if (!replay.info.isEncrypted) {
    replay.popOffset(1)
  }
};

module.exports = parseCheckpoint;
