const cleanPathSuffix = require('../utils/cleanPathSuffix');
const cleanStaticIdSuffix = require('../utils/cleanStaticIdSuffix');
const GlobalData = require('../utils/globalData');
const removePathPrefix = require('../utils/removePathPrefix');
const Actor = require('./Actor');
const NetFieldExportGroup = require('./NetFieldExports/NetFieldExportGroup');
const NetFieldParser = require('./NetFieldExports/NetFieldParser');

class NetGuidCache {
  NetFieldExportGroupMap = {};
  NetFieldExportGroupIndexToGroup = {};
  NetGuidToPathName = {};
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
    return this.NetGuidToPathName[netGuid];
  }

  GetNetFieldExportGroupString(path) {
    return this.NetFieldExportGroupMap[path];
  }

  GetNetFieldExportGroup(netguid, globalData) {
    if (typeof netguid === 'string') {
      return this.GetNetFieldExportGroupString(netguid);
    }

    if (this.netguidToNetFieldExportgroup[netguid] !== undefined) {
      return this.netguidToNetFieldExportgroup[netguid];
    }

    let group = this.ArchTypeToExportGroup[netguid];

    if (!group) {
      let path = this.NetGuidToPathName[netguid];

      if (!path) {
        this.netguidToNetFieldExportgroup[netguid] = null;
        return null;
      }

      group = this.NetFieldExportGroupMapPathFixed[netguid];

      path = globalData.netFieldParser.getRedirect(path);

      if (group) {
        this.ArchTypeToExportGroup[netguid] = this.NetFieldExportGroupMapPathFixed[netguid];
        this.netguidToNetFieldExportgroup[netguid] = group;

        return this.netguidToNetFieldExportgroup[netguid];
      }

      let returnValue;
      const NetFieldExportGroupMapEntries = Object.entries(this.NetFieldExportGroupMap);

      for (let i = 0; i < NetFieldExportGroupMapEntries.length; i++) {
        const [groupPath, value] = NetFieldExportGroupMapEntries[i];

        let groupPathFixed = this.CleanedPaths[value.pathNameIndex];

        if (!groupPathFixed) {
          groupPathFixed = removePathPrefix(groupPath);
          this.CleanedPaths[value.pathNameIndex] = groupPathFixed;
        }

        if (path.includes(groupPathFixed)) {
          this.NetFieldExportGroupMapPathFixed[netguid] = this.NetFieldExportGroupMap[groupPath];
          this.ArchTypeToExportGroup[netguid] = this.NetFieldExportGroupMap[groupPath];

          returnValue = this.NetFieldExportGroupMap[groupPath];

          break;
        }
      }

      if (returnValue) {
        this.netguidToNetFieldExportgroup[netguid] = returnValue;

        return this.netguidToNetFieldExportgroup[netguid];
      }

      const cleanedPath = cleanPathSuffix(path);

      for (let i = 0; i < NetFieldExportGroupMapEntries.length; i++) {
        const [groupPath, value] = NetFieldExportGroupMapEntries[i];

        const groupPathFixed = this.CleanedPaths[value.PathNameIndex];

        if (groupPathFixed) {
          if (this.groupPathFixed.includes(cleanedPath)) {
            this.NetFieldExportGroupMapPathFixed[netguid] = this.NetFieldExportGroupMap[groupPath];
            this.ArchTypeToExportGroup[netguid] = this.NetFieldExportGroupMap[groupPath];

            returnValue = this.NetFieldExportGroupMap[groupPath];

            break;
          }
        }
      }

      if (returnValue) {
        this.netguidToNetFieldExportgroup[netguid] = this.netguidToNetFieldExportgroup[netguid];

        return returnValue;
      }

      this.failedPaths[netguid] = path;
      this.netguidToNetFieldExportgroup[netguid] = null;
      return null;
    }

    this.netguidToNetFieldExportgroup[netguid] = group;

    return group;
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
    let staticActorId = this.NetGuidToPathName[netGuid];

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
