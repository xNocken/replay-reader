const NetBitReader = require('../Classes/NetBitReader');
const NetGuidCache = require('../Classes/NetGuidCache');
const NetworkGUID = require('../Classes/NetworldGUID');
const Replay = require('../Classes/Replay');
const removePathPrefix = require('../utils/removePathPrefix');

const guidCache = new NetGuidCache();

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

      if ((flags & 4) === 1) {
        const checksum = replay.readUInt32();
      }

      if (isExportingNetGUIDBunch) {
        guidCache.NetGuidToPathName[netGuid.Value] = removePathPrefix(pathName);
      }

      return netGuid;
    }
  }

  return netGuid;
};

/**
 * I hope i find out what it does, when its finished
 * @param {Replay} replay the replay
 */
const readNetFieldExports = (replay) => {
  const numLayoutCmdExports = replay.readIntPacked();

  for (let i = 0; i < numLayoutCmdExports; i++) {
    throw Error('read net field exports not implemented yet');

    const pathNameIndex = replay.readIntPacked();
    const isExported = replay.readIntPacked() === 1;
    let group;

    if (isExported) {
      const pathname = replay.readString();
      const numExports = replay.readIntPacked();

      if (netFieldExportGroupMap[pathname]) {
        group = netFieldExportGroupMap[pathname];
      } else {
        group = {
          pathname,
          pathNameIndex,
          netFieldExportsLength: numExports,
        };

        group.netFieldExports = [];
        netFieldExportGroupMap[pathname] = group;
      }
    } else {

    }
  }
}

/**
 * same as above
 * @param {Replay} replay the replay
 */
const readNetExportGuids = (replay) => {
  const numGuids = replay.readIntPacked();

  for (let i = 0; i < numGuids; i++) {
    const size = replay.readInt32();
    const reader = new NetBitReader(replay.readBytes(size));

    internalLoadObject(reader, true);
  }
}

/**
 * Read the export data :D
 * @param {Replay} replay the replay
 */
const readExportData = (replay) => {
  readNetFieldExports(replay);
  readNetExportGuids(replay);
};

module.exports = readExportData;
