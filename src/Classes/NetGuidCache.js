const removePathPrefix = require("../utils/removePathPrefix");

class NetGuidCache {
  NetFieldExportGroupMap = {};
  NetFieldExportGroupIndexToGroup = {};
  NetGuidToPathName = {};
  NetFieldExportGroupMapPathFixed = {};

  /**
   *
   * @param {string} group
   * @param {NetFieldExportGroup} exportGroup
   */
  addToExportGroupMap(group, exportGroup) {
    if (group.endsWith('ClassNetCache')) {
      exportGroup.pathName = removePathPrefix(exportGroup.pathName);
    }

    this.NetFieldExportGroupMap[group] = exportGroup;
    this.NetFieldExportGroupIndexToGroup[exportGroup.pathNameIndex] = group;
  }

  tryGetPathName(netGuid) {
    this.NetGuidToPathName[netGuid];
  }

  getNetFieldExportLayout(netguid) {
    // TODO
  }
}

module.exports = NetGuidCache;
