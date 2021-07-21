const NetFieldExportGroup = require('../Classes/NetFieldExports/NetFieldExportGroup');
const Replay = require('../Classes/Replay');
const readNetFieldExport = require('./readNetFieldExport');

/**
 * Read net field exports
 * @param {Replay} replay the replay
 */
const readNetFieldExports = (replay, globalData) => {
  const numLayoutCmdExports = replay.readIntPacked();

  for (let i = 0; i < numLayoutCmdExports; i++) {
    const pathNameIndex = replay.readIntPacked();
    const isExported = replay.readIntPacked() === 1;
    let group;

    if (isExported) {
      const pathname = replay.readString();
      const numExports = replay.readIntPacked();

      group = globalData.netGuidCache.NetFieldExportGroupMap[pathname];
      if (!group) {
        group = new NetFieldExportGroup();
        group.pathName = pathname;
        group.pathNameIndex = pathNameIndex;
        group.netFieldExportsLength = numExports;

        group.netFieldExports = {};
        globalData.netGuidCache.addToExportGroupMap(pathname, group, globalData.netFieldParser, globalData);
      }
    } else {
      group = globalData.netGuidCache.GetNetFieldExportGroupFromIndex(pathNameIndex);
    }

    const netField = readNetFieldExport(replay);

    if (group && netField) {
      group.netFieldExports[netField.handle] = netField;
    }
  }
}

module.exports = readNetFieldExports;
