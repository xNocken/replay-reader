const cleanPathSuffix = require('../utils/cleanPathSuffix');
const cleanStaticIdSuffix = require('../utils/cleanStaticIdSuffix');
const getFullGuidPath = require('../utils/getFullGuidPath');
const removePathPrefix = require('../utils/removePathPrefix');
const Actor = require('./Actor');
const NetFieldExportGroup = require('./NetFieldExports/NetFieldExportGroup');
const NetFieldParser = require('./NetFieldExports/NetFieldParser');

class NetGuidCache {
  NetFieldExportGroupMap = {};
  NetFieldExportGroupIndexToGroup = {};
  NetGuids = {};
  NetFieldExportGroupMapPathFixed = {};
  ArchTypeToExportGroup = {};
  failedPaths = [];
  CleanedPaths = {};
  CleanedClassNetCache = {};
  networkGameplayTagNodeIndex = null;
  actorIdToActorMap = [];
  netguidToNetFieldExportgroup = [];
  staticActorIdMap = {};
  notReadGroup = {};

  /**
   *
   * @param {string} pathName
   * @param {NetFieldExportGroup} exportGroup
   * @param {GlobalData} globalData
   */
  addToExportGroupMap(pathName, exportGroup, globalData) {
    if (pathName.endsWith('ClassNetCache')) {
      exportGroup.pathName = removePathPrefix(exportGroup.pathName);
    }

    const netFieldExport = globalData.netFieldParser.getNetFieldExport(exportGroup.pathName);

    if (pathName === 'NetworkGameplayTagNodeIndex') {
      this.NetworkGameplayTagNodeIndex = exportGroup;
      this.NetFieldExportGroupMap[pathName] = exportGroup;
      this.NetFieldExportGroupIndexToGroup[exportGroup.pathNameIndex] = pathName;

      return;
    }

    if (!netFieldExport) {
      if (globalData.debug) {
        this.notReadGroup[exportGroup.pathNameIndex] = exportGroup;
      }

      return;
    }

    if (netFieldExport.type === 'ClassNetCache') {
      const baseName = pathName.split('_ClassNetCache')[0];

      if (!this.NetFieldExportGroupMap[baseName]) {
        const baseGroup = new NetFieldExportGroup();
        baseGroup.pathName = baseName;
        baseGroup.pathNameIndex = 0;
        baseGroup.netFieldExportsLength = 0;
        baseGroup.netFieldExports = [];

        this.NetFieldExportGroupMap[baseName] = baseGroup;

        const failedIndex = this.failedPaths.indexOf(baseName.split('.')[1]);

        if (failedIndex !== -1) {
          this.failedPaths.splice(this.failedPaths.indexOf(baseName.split('.')[1]), 1);
          delete this.netguidToNetFieldExportgroup[failedIndex];
        }
      }
    }

    exportGroup.parseUnknownHandles = netFieldExport.parseUnknownHandles;
    exportGroup.storeAsHandle = netFieldExport.storeAsHandle;
    exportGroup.customExportName = netFieldExport.customExportName;
    exportGroup.exportGroup = netFieldExport.exportGroup;
    exportGroup.exportName = netFieldExport.exportName;
    exportGroup.exportType = netFieldExport.exportType;
    exportGroup.type = netFieldExport.type;

    if (netFieldExport.staticActorIds) {
      netFieldExport.staticActorIds.forEach((staticActorId) => {
        this.staticActorIdMap[staticActorId] = exportGroup;
      });
    }

    this.NetFieldExportGroupMap[pathName] = exportGroup;
    this.NetFieldExportGroupIndexToGroup[exportGroup.pathNameIndex] = pathName;

    return exportGroup;
  }

  tryGetPathName(netGuid) {
    return this.NetGuids[netGuid]?.path;
  }

  GetNetFieldExportGroupString(path) {
    return this.NetFieldExportGroupMap[path];
  }

  GetNetFieldExportGroup(netguid, globalData) {
    const group = this.ArchTypeToExportGroup[netguid];

    if (group) {
      return group;
    }

    const fixedGroup = this.NetFieldExportGroupMapPathFixed[netguid];

    if (fixedGroup) {
      this.ArchTypeToExportGroup[netguid] = fixedGroup;

      return fixedGroup;
    }

    const netGuid = this.NetGuids[netguid];

    if (!netGuid) {
      this.ArchTypeToExportGroup[netguid] = null;

      return null;
    }

    const path = globalData.netFieldParser.getRedirect(getFullGuidPath(netGuid));

    const returnValue = this.NetFieldExportGroupMap[path];

    if (returnValue) {
      this.ArchTypeToExportGroup[netguid] = returnValue;

      return returnValue;
    }

    this.failedPaths[netguid] = path;
    this.ArchTypeToExportGroup[netguid] = null;

    return null;
  }

  GetNetFieldExportGroupFromIndex(index) {
    const group = this.NetFieldExportGroupIndexToGroup[index];

    if (!group) {
      if (this.notReadGroup[index]) {
        return this.notReadGroup[index];
      }

      return null;
    }

    return this.NetFieldExportGroupMap[group];
  }

  tryGetTagName(tagIndex) {
    if (tagIndex < this.NetworkGameplayTagNodeIndex.netFieldExportsLength) {
      if (this.NetworkGameplayTagNodeIndex.netFieldExports[tagIndex]) {
        return this.NetworkGameplayTagNodeIndex.netFieldExports[tagIndex].name;
      }
    }

    return '';
  }

  tryGetClassNetCache(group, useFullName) {
    if (!group) {
      return false;
    }

    let classNetCachePath = this.CleanedClassNetCache[group];

    if (!classNetCachePath) {
      classNetCachePath = useFullName ? `${group}_ClassNetCache` : `${removePathPrefix(group)}_ClassNetCache`;
      this.CleanedClassNetCache[group] = classNetCachePath;
    }

    return this.NetFieldExportGroupMap[classNetCachePath];
  }

  /**
   *
   * @param {Actor} inActor
   */
  addActor(inActor) {
    this.actorIdToActorMap[inActor.actorNetGUID.value] = inActor;
  }

  tryGetActorById(netGuid) {
    return this.actorIdToActorMap[netGuid];
  }

  getFromStaticActorId(path) {
    if (!path) {
      return null;
    }
  }

  getStaticActorExportGroup(netGuid) {
    let staticActorId = this.NetGuids[netGuid]?.path;

    if (!staticActorId) {
      return { staticActorId: null, group: null };
    }

    const cleanedPath = cleanStaticIdSuffix(staticActorId);

    const exportGroup = this.staticActorIdMap[cleanedPath];

    return { staticActorId, group: exportGroup || null };
  }

  cleanForCheckpoint() {
    this.NetFieldExportGroupMap = {};
    this.NetFieldExportGroupIndexToGroup = {};
    this.NetGuidToPathName = {};
    this.NetFieldExportGroupMapPathFixed = {};
    this.ArchTypeToExportGroup = {};
    this.failedPaths = [];
    this.CleanedPaths = {};
    this.CleanedClassNetCache = {};
    this.networkGameplayTagNodeIndex = null;
    this.actorIdToActorMap = [];
    this.netguidToNetFieldExportgroup = [];
    this.staticActorIdMap = {};
  }
}

module.exports = NetGuidCache;
