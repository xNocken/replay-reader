const NetworkGUID = require('../../Classes/NetworkGUID');
const removePathPrefix = require('./remove-path-prefix');

/**
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
      netGuid.outer = internalLoadObject(replay, true, globalData, internalLoadObjectRecursionCount + 1);

      const pathName = replay.readString();

      if ((flags & 4) == 4) {
        // checksum
        replay.readUInt32();
      }

      if (isExportingNetGUIDBunch) {
        const cleanedPath = removePathPrefix(pathName);

        globalData.netGuidCache.NetGuids[netGuid.value] = {
          value: netGuid.value,
          path: cleanedPath,
          outer: globalData.netGuidCache.NetGuids[netGuid.outer.value],
        };

        if (globalData.debug) {
          globalData.debugNetGuidToPathName.push({
            key: netGuid.value,
            val: cleanedPath,
            outer: netGuid.outer.value,
          });
        }
      }

      return netGuid;
    }
  }

  return netGuid;
};

module.exports = internalLoadObject;
