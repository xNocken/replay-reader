const NetworkGUID = require('../../Classes/NetworkGUID');
const Replay = require('../Classes/Replay');
const removePathPrefix = require('../utils/removePathPrefix');

/**
 * @param {Replay} replay
 * @param {boolean} isExportingNetGUIDBunch
 * @param {number} internalLoadObjectRecursionCount
 *
 * @returns {NetworkGUID}
 */
const internalLoadObject = (replay, isExportingNetGUIDBunch, globalData, internalLoadObjectRecursionCount = 0) => {
  if (internalLoadObjectRecursionCount > 16) {
    return new NetworkGUID();
  }

  const netGuid = new NetworkGUID();
  netGuid.value = replay.readIntPacked();

  if (!netGuid.isValid()) {
    return netGuid;
  }

  if (netGuid.isDefault() || isExportingNetGUIDBunch) {
    const flags = replay.readByte();

    if ((flags & 1) === 1) {
      // outer guid
      internalLoadObject(replay, true, globalData, internalLoadObjectRecursionCount + 1);
      const pathName = replay.readString();

      if ((flags & 4) == 4) {
        // checksum
        replay.readUInt32();
      }

      if (isExportingNetGUIDBunch) {
        globalData.netGuidCache.NetGuidToPathName[netGuid.value] = removePathPrefix(pathName);

        if (globalData.debug) {
          globalData.debugNetGuidToPathName.push({
            key: netGuid.value,
            val: globalData.netGuidCache.NetGuidToPathName[netGuid.value],
          });
        }
      }

      return netGuid;
    }
  }

  return netGuid;
};

module.exports = internalLoadObject;
