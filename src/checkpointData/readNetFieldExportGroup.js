const NetFieldExportGroup = require("../Classes/NetFieldExports/NetFieldExportGroup");
const readNetFieldExport = require("../replayData/readNetFieldExport");

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

const readNetFieldExportGroup = (replay, globalData) => {
  const theGroup = new NetFieldExportGroup();
  theGroup.pathName = replay.readString();
  theGroup.pathNameIndex = replay.readIntPacked();
  theGroup.netFieldExportsLength = replay.readIntPacked();
  theGroup.netFieldExports = [];

  const group = globalData.netGuidCache.addToExportGroupMap(theGroup.pathName, theGroup, globalData) || theGroup;

  for (let i = 0; i < group.netFieldExportsLength; i++) {
    const netField = readNetFieldExport(replay);

    if (!netField) {
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

  return group;
};

module.exports = readNetFieldExportGroup;
