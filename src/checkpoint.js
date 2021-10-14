const NetworkGUID = require('../Classes/NetworkGUID');
const readNetFieldExportGroup = require('./checkpointData/readNetFieldExportGroup');
const decompress = require('./decompress');
const parsePlaybackPackets = require('./replayData/parsePlaybackPackets');
const removePathPrefix = require('./utils/removePathPrefix');

const parseCheckpoint = async (replay, data, globalData) => {
  replay.goTo(data.startPos);

  globalData.resetForCheckpoint();

  const decrypted = replay.decryptBuffer(data.sizeInBytes);
  const binaryReplay = await decompress(decrypted, replay.info.IsCompressed);

  if (binaryReplay.hasDeltaCheckpoints()) {
    binaryReplay.skipBytes(4); // checkpoint size
  }

  if (binaryReplay.hasLevelStreamingFixes()) {
    binaryReplay.skipBytes(8); // packet offset
  }

  if (binaryReplay.header.NetworkVersion >= 6) {
    binaryReplay.skipBytes(4); // level for checkpoint
  }

  if (binaryReplay.header.NetworkVersion >= 8) {
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
      outerGuid,
    }

    if (binaryReplay.header.NetworkVersion < 15) {
      cacheObject.pathName = binaryReplay.readString();
    } else {
      const isExported = binaryReplay.readByte() === 1;

      if (isExported) {
        cacheObject.pathName = binaryReplay.readString();

        cacheGuids.push(cacheObject);
      } else {
        const pathNameIndex = binaryReplay.readIntPacked();

        if (pathNameIndex < cacheGuids.length) {
          cacheObject.pathName = cacheGuids[pathNameIndex].pathName;
        }
      }
    }

    if (binaryReplay.header.NetworkVersion < 16) {
      cacheObject.checksum = binaryReplay.readUint32();
    }

    cacheObject.flags = binaryReplay.readByte();

    globalData.netGuidCache.NetGuidToPathName[guid] = removePathPrefix(cacheObject.pathName);

    if (globalData.debug) {
      globalData.debugNetGuidToPathName.push({
        key: guid,
        val: globalData.netGuidCache.NetGuidToPathName[guid],
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

  if (!replay.info.IsEncrypted) {
    replay.popOffset(1)
  }
};

module.exports = parseCheckpoint;
