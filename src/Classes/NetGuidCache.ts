import pathhhh from 'path';
import { Actor } from '../../types/lib';
import { NetFieldExportGroup, NetFieldExportGroupInternal } from '../../types/nfe';
import { ActorMap, NetGuidMap, NumberToString, StringToString } from '../../types/replay';
import { cleanStaticIdSuffix } from '../utils/clean-static-id-suffix';
import { getFullGuidPath } from '../utils/get-full-guid-path';
import { removePathPrefix } from '../utils/remove-path-prefix';
import GlobalData from './GlobalData';
export class NetGuidCache {
  netFieldExportGroupMap: Record<string, NetFieldExportGroupInternal> = {};
  netFieldExportGroupIndexToGroup: NumberToString = {};
  netGuids: NetGuidMap = {};
  /** used as a cache for the get export group functions */
  archTypeToExportGroup: Record<string, NetFieldExportGroupInternal> = {};
  failedPaths: string[] = [];
  cleanedClassNetCache: StringToString = {};
  /** Contains some hardcoded strings */
  networkGameplayTagNodeIndex?: NetFieldExportGroupInternal = null;
  /** Contains all actors */
  actorIdToActorMap: ActorMap = {};
  staticActorIdMap: Record<string, NetFieldExportGroupInternal> = {};
  /** Contains groups that dont have a netFieldExport config but are still required to be parsed in debug mode */
  notReadGroups: Record<string, NetFieldExportGroupInternal> = {};
  /** Contains all the net field exports and can be accessed by using the path or customExportName */
  nfeReferences: Record<string, NetFieldExportGroupInternal> = {};

  addToExportGroupMap(pathName: string, exportGroup: NetFieldExportGroup, globalData: GlobalData) {
    if (pathName.endsWith('ClassNetCache')) {
      exportGroup.pathName = removePathPrefix(exportGroup.pathName);
    }

    const netFieldExport = globalData.netFieldParser.getNetFieldExport(exportGroup.pathName);

    if (pathName === 'NetworkGameplayTagNodeIndex') {
      const baseGroup: NetFieldExportGroupInternal = {
        pathName: exportGroup.pathName,
        pathNameIndex: exportGroup.pathNameIndex,
        netFieldExportsLength: exportGroup.netFieldExportsLength,
        netFieldExports: [],
        exportName: 'NetworkGameplayTagNodeIndex',
      };

      this.networkGameplayTagNodeIndex = baseGroup;
      this.netFieldExportGroupMap[pathName] = baseGroup;
      this.netFieldExportGroupIndexToGroup[exportGroup.pathNameIndex] = pathName;

      return baseGroup;
    }

    if (!netFieldExport) {
      if (globalData.options.debug) {
        const baseGroup: NetFieldExportGroupInternal = {
          pathName: exportGroup.pathName,
          pathNameIndex: exportGroup.pathNameIndex,
          netFieldExportsLength: exportGroup.netFieldExportsLength,
          netFieldExports: [],
          exportName: pathhhh.basename(exportGroup.pathName),
        };

        this.notReadGroups[exportGroup.pathNameIndex] = baseGroup;

        return baseGroup;
      }

      return null;
    }

    if (netFieldExport.type === 'classNetCache') {
      const baseName = pathName.split('_ClassNetCache')[0];

      if (!this.netFieldExportGroupMap[baseName]) {
        const baseGroup: NetFieldExportGroupInternal = {
          pathName: baseName,
          pathNameIndex: 0,
          netFieldExportsLength: 0,
          netFieldExports: [],
          exportName: netFieldExport.customExportName || pathhhh.basename(exportGroup.pathName),
        };

        this.netFieldExportGroupMap[baseName] = baseGroup;
        this.nfeReferences[baseName] = baseGroup;

        const failedIndex = this.failedPaths.indexOf(baseName.split('.')[1]);

        if (failedIndex !== -1) {
          this.failedPaths.splice(this.failedPaths.indexOf(baseName.split('.')[1]), 1);
        }
      }
    }

    const theGroup: NetFieldExportGroupInternal = {
      parseUnknownHandles: netFieldExport.parseUnknownHandles,
      storeAsHandle: netFieldExport.storeAsHandle,
      storeAsHandleMaxDepth: netFieldExport.storeAsHandleMaxDepth,
      exportName: netFieldExport.customExportName || pathhhh.basename(exportGroup.pathName),
      pathName: exportGroup.pathName,
      pathNameIndex: exportGroup.pathNameIndex,
      netFieldExportsLength: exportGroup.netFieldExportsLength,
      netFieldExports: [],
    }

    this.netFieldExportGroupMap[pathName] = theGroup;
    this.nfeReferences[theGroup.exportName] = theGroup;
    this.netFieldExportGroupIndexToGroup[exportGroup.pathNameIndex] = pathName;

    return theGroup;
  }

  tryGetPathName(netGuid: number) {
    return this.netGuids[netGuid]?.path;
  }

  tryGetFullPathName(netGuid: number) {
    return getFullGuidPath(this.netGuids[netGuid]);
  }

  getNetFieldExportGroupString(path: string) {
    return this.netFieldExportGroupMap[path];
  }

  getNetFieldExportGroup(netguid: number, globalData: GlobalData) {
    const group = this.archTypeToExportGroup[netguid];

    if (group) {
      return group;
    }

    const netGuid = this.netGuids[netguid];

    if (!netGuid) {
      this.archTypeToExportGroup[netguid] = null;

      return null;
    }

    const redirect = globalData.netFieldParser.getRedirect(netGuid.path);

    if (redirect) {
      const theGroup = this.netFieldExportGroupMap[redirect];

      if (theGroup) {
        this.archTypeToExportGroup[netguid] = theGroup;

        return theGroup;
      }
    }

    const path = getFullGuidPath(netGuid);

    const returnValue = this.netFieldExportGroupMap[path];

    if (returnValue) {
      this.archTypeToExportGroup[netguid] = returnValue;

      return returnValue;
    }

    this.failedPaths[netguid] = path;
    this.archTypeToExportGroup[netguid] = null;

    return null;
  }

  getNetFieldExportGroupFromIndex(index: number) {
    const group = this.netFieldExportGroupIndexToGroup[index];

    if (!group) {
      if (this.notReadGroups[index]) {
        return this.notReadGroups[index];
      }

      return null;
    }

    return this.netFieldExportGroupMap[group];
  }

  tryGetTagName(tagIndex: number) {
    if (tagIndex < this.networkGameplayTagNodeIndex.netFieldExportsLength) {
      if (this.networkGameplayTagNodeIndex.netFieldExports[tagIndex]) {
        return this.networkGameplayTagNodeIndex.netFieldExports[tagIndex].name;
      }
    }

    return null;
  }

  tryGetClassNetCache(group: string, useFullName: boolean): NetFieldExportGroupInternal {
    if (!group) {
      return null;
    }

    let classNetCachePath = this.cleanedClassNetCache[group];

    if (!classNetCachePath) {
      classNetCachePath = useFullName ? `${group}_ClassNetCache` : `${removePathPrefix(group)}_ClassNetCache`;

      this.cleanedClassNetCache[group] = classNetCachePath;
    }

    return this.netFieldExportGroupMap[classNetCachePath];
  }

  addActor(inActor: Actor) {
    this.actorIdToActorMap[inActor.actorNetGUID.value] = inActor;
  }

  tryGetActorById(netGuid: number) {
    return this.actorIdToActorMap[netGuid];
  }

  getStaticActorExportGroup(netGuid: number) {
    let staticActorId = this.netGuids[netGuid];

    if (!staticActorId) {
      return { staticActorId: null, group: null };
    }

    const cleanedPath = cleanStaticIdSuffix(staticActorId.path);
    const fullStaticActorId = getFullGuidPath(staticActorId);

    const exportGroup = this.staticActorIdMap[cleanedPath];

    return { staticActorId: fullStaticActorId, group: exportGroup || null };
  }

  addStaticActorId(path: string, exportGroup: NetFieldExportGroupInternal) {
    this.staticActorIdMap[path] = exportGroup;
  }

  getNFEReference(pathName: string) {
    return this.nfeReferences[pathName];
  }

  cleanForCheckpoint() {
    this.netFieldExportGroupMap = {};
    this.netFieldExportGroupIndexToGroup = {};
    this.archTypeToExportGroup = {};
    this.failedPaths = [];
    this.cleanedClassNetCache = {};
    this.networkGameplayTagNodeIndex = null;
    this.actorIdToActorMap = [];
    this.staticActorIdMap = {};
    this.nfeReferences = {};
  }
}
