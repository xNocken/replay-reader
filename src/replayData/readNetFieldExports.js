const NetFieldExportGroup = require('../Classes/NetFieldExports/NetFieldExportGroup');
const Replay = require('../Classes/Replay');
const readNetFieldExport = require('./readNetFieldExport');

const addToUnreadGroups = (group, netField, globalData) => {
  if (!globalData.debug) {
    return;
  }

  if (!globalData.debugNotReadingGroups[group.pathName]) {
    globalData.debugNotReadingGroups[group.pathName] = {
      pathName: group.pathName,
      properties: {},
    }
  }

  globalData.debugNotReadingGroups[group.pathName].properties[netField.handle] = netField;
}

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
        group.netFieldExports = [];

        globalData.netGuidCache.addToExportGroupMap(pathname, group, globalData);
      }
    } else {
      group = globalData.netGuidCache.GetNetFieldExportGroupFromIndex(pathNameIndex);
    }

    const netField = readNetFieldExport(replay);

    if (!netField || !group) {
      continue;
    }

    if (group.parseUnknownHandles || group.pathName === 'NetworkGameplayTagNodeIndex') {
      group.netFieldExports[netField.handle] = netField;

      continue;
    }

    const netFieldExportGroup = globalData.netFieldParser.getNetFieldExport(group.pathName);

    if (!netFieldExportGroup) {
      addToUnreadGroups(group, netField, globalData);
      continue;
    }

    const netFieldExport = netFieldExportGroup.properties[netField.name];

    if (!netFieldExport) {
      addToUnreadGroups(group, netField, globalData);
      continue;
    }

    group.netFieldExports[netField.handle] = {
      ...netFieldExport,
      ...netField,
    };
  }
}

module.exports = readNetFieldExports;
