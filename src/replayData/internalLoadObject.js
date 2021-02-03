const NetworkGUID = require('../../Classes/NetworkGUID');
const Replay = require('../Classes/Replay');
const netGuidCache = require('../utils/netGuidCache');
const removePathPrefix = require('../utils/removePathPrefix');

/**
 * @param {Replay} replay
 * @param {boolean} isExportingNetGUIDBunch
 * @param {number} internalLoadObjectRecursionCount
 *
 * @returns {NetworkGUID}
 */
const internalLoadObject = (replay, isExportingNetGUIDBunch, internalLoadObjectRecursionCount = 0) => {
  if (internalLoadObjectRecursionCount > 16) {
    return new NetworkGUID();
  }

  const netGuid = new NetworkGUID();
  netGuid.value = replay.readIntPacked();

  if (!netGuid.isValid()) {
    return netGuid;
  }

  let flags = 0;

  if (netGuid.isDefault() || isExportingNetGUIDBunch) {
    flags = replay.readByte()[0];

    if ((flags & 1) === 1) {
      const outerGuid = internalLoadObject(replay, true, internalLoadObjectRecursionCount + 1);
      const pathName = replay.readString();

      if ((flags & 4) == 4) {
        const checksum = replay.readUInt32();
      }

      if (isExportingNetGUIDBunch) {
        netGuidCache.NetGuidToPathName[netGuid.value] = removePathPrefix(pathName);
      }

      return netGuid;
    }
  }

  return netGuid;
};

module.exports = internalLoadObject;
