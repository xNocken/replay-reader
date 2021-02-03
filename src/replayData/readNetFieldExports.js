const NetBitReader = require('../Classes/NetBitReader');
const NetFieldExportGroup = require('../Classes/NetFieldExports/NetFieldExportGroup');
const Replay = require('../Classes/Replay');
const netGuidCache = require('../utils/netGuidCache');
const fs = require('fs');
const readNetFieldExport = require('./readNetFieldExport');

/**
 * I hope i find out what it does, when its finished
 * @param {Replay} replay the replay
 */
const readNetFieldExports = (replay) => {
  const numLayoutCmdExports = replay.readIntPacked();

  for (let i = 0; i < numLayoutCmdExports; i++) {
    const pathNameIndex = replay.readIntPacked();
    const isExported = replay.readIntPacked() === 1;
    let group;

    if (isExported) {
      const pathname = replay.readString();
      const numExports = replay.readIntPacked();
      fs.appendFileSync('ok.txt', pathname + '\n');

      group = netGuidCache.NetFieldExportGroupMap[pathname];
      if (!group) {
        group = new NetFieldExportGroup();
        group.pathName = pathname;
        group.pathNameIndex = pathNameIndex;
        group.netFieldExportsLength = numExports;

        group.netFieldExports = [];
        netGuidCache.addToExportGroupMap(pathname, group);
      }
    } else {
      group = netGuidCache.GetNetFieldExportGroupFromIndex(pathNameIndex);
    }

    const netField = readNetFieldExport(replay);

    if (group) {
      group.netFieldExports[netField.handle] = netField;
    }
  }
}

module.exports = readNetFieldExports;
