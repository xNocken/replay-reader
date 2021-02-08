const cleanPathSuffix = require('../utils/cleanPathSuffix');
const removePathPrefix = require('../utils/removePathPrefix');
const NetFieldExportGroup = require('./NetFieldExports/NetFieldExportGroup');

class NetGuidCache {
  NetFieldExportGroupMap = {};
  NetFieldExportGroupIndexToGroup = {};
  NetGuidToPathName = {};
  NetFieldExportGroupMapPathFixed = {};
  ArchTypeToExportGroup = {};
  FailedPaths = [];
  CleanedPaths = {};
  CleanedClassNetCache = {};
  _networkGameplayTagNodeIndex = null;

  get NetworkGameplayTagNodeIndex() {
    if (!this._networkGameplayTagNodeIndex) {
      const nodeIndex = this.NetFieldExportGroupMap["NetworkGameplayTagNodeIndex"];

      if (nodeIndex !== undefined) {
        this._networkGameplayTagNodeIndex = nodeIndex;
      }
    }

    return this._networkGameplayTagNodeIndex;
  };

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
    return this.NetGuidToPathName[netGuid];
  }

  GetNetFieldExportGroup(netguid) {
    let group = this.ArchTypeToExportGroup[netguid];

    if (!group) {
      const path = this.NetGuidToPathName[netguid];

      if (!path) {
        return null;
      }

      if (this.FailedPaths.includes(netguid)) {
        return null;
      }

      group = this.NetFieldExportGroupMapPathFixed[netguid];

      if (group) {
        this.ArchTypeToExportGroup[netguid] = this.NetFieldExportGroupMapPathFixed[netguid];
        return group;
      }

      let returnValue;

      Object.entries(this.NetFieldExportGroupMap).forEach((groupPathKvp) => {
        if (returnValue) {
          return;
        }

        const groupPath = groupPathKvp[0];

        let groupPathFixed = this.CleanedPaths[groupPathKvp[1].pathNameIndex];

        if (!groupPathFixed) {
          groupPathFixed = removePathPrefix(groupPath);
          this.CleanedPaths[groupPathKvp[1].pathNameIndex] = groupPathFixed;
        }

        if (path.includes(groupPathFixed)) {
          this.NetFieldExportGroupMapPathFixed[netguid] = this.NetFieldExportGroupMap[groupPath];
          this.ArchTypeToExportGroup[netguid] = this.NetFieldExportGroupMap[groupPath];

          returnValue = this.NetFieldExportGroupMap[groupPath];
        }
      });

      if (returnValue) {
        return returnValue;
      }

      const cleanedPath = cleanPathSuffix(path);

      Object.entries(this.NetFieldExportGroupMap).forEach((groupPathKvp) => {
        if (returnValue) {
          return;
        }

        const [groupPath] = groupPathKvp;

        const groupPathFixed = this.CleanedPaths[groupPathKvp[1].PathNameIndex];

        if (groupPathFixed) {
          if (this.groupPathFixed.includes(cleanedPath)) {
            this.NetFieldExportGroupMapPathFixed[netguid] = this.NetFieldExportGroupMap[groupPath];
            this.ArchTypeToExportGroup[netguid] = this.NetFieldExportGroupMap[groupPath];

            returnValue =  this.NetFieldExportGroupMap[groupPath];
          }
        }
      });

      if (returnValue) {
        return returnValue;
      }

      this.FailedPaths.push(path);
      return null;
    }

    return group;
  }

  GetNetFieldExportGroupFromIndex(index) {
    const group = this.NetFieldExportGroupIndexToGroup[index];

    if (!group) {
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
}

module.exports = NetGuidCache;
