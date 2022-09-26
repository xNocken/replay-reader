import { NetFieldExport, NetFieldExportGroup, NetFieldExportGroupInternal } from "../../../types/replay";
import GlobalData from "../../Classes/GlobalData";
import Replay from "../../Classes/Replay";

import { readNFE } from './read-nfe';

const addToUnreadGroups = (group: NetFieldExportGroupInternal, netField: NetFieldExport, globalData: GlobalData) => {
  if (!globalData.options.debug) {
    return;
  }

  if (!globalData.debugNotReadingGroups[group.pathName]) {
    globalData.debugNotReadingGroups[group.pathName] = {
      pathName: group.pathName,
      pathNameIndex: group.pathNameIndex,
      netFieldExportsLength: group.netFieldExportsLength,
      properties: {},
    };
  }

  globalData.debugNotReadingGroups[group.pathName].properties[netField.handle] = netField;
};

export const readNetFieldExports = (replay: Replay, globalData: GlobalData, usePackedInt = true) => {
  const numLayoutCmdExports = usePackedInt ? replay.readIntPacked() : replay.readUInt32();

  for (let i = 0; i < numLayoutCmdExports; i++) {
    const pathNameIndex = replay.readIntPacked();
    const isExported = usePackedInt ? replay.readIntPacked() === 1 : replay.readBit();
    let group: NetFieldExportGroupInternal;

    if (isExported) {
      const pathname = replay.readString();
      const numExports = usePackedInt ? replay.readIntPacked() : replay.readUInt32();

      if (pathname.match('FortInventory_ClassNetCache')) {
        console
      }

      group = globalData.netGuidCache.netFieldExportGroupMap[pathname];

      if (!group) {
        const theGroup: NetFieldExportGroup = {
          pathName: pathname,
          pathNameIndex: pathNameIndex,
          netFieldExportsLength: numExports,
        };

        group = globalData.netGuidCache.addToExportGroupMap(pathname, theGroup, globalData);
      } else if (!group.netFieldExportsLength) {
        group.netFieldExportsLength = numExports;
        group.pathNameIndex = pathNameIndex;
        globalData.netGuidCache.netFieldExportGroupIndexToGroup[pathNameIndex] = pathname;
      }
    } else {
      group = globalData.netGuidCache.getNetFieldExportGroupFromIndex(pathNameIndex);
    }

    const netField = readNFE(replay);

    if (!netField || !group) {
      continue;
    }

    const netFieldExportGroup = globalData.netFieldParser.getNetFieldExport(group.pathName);

    if (!netFieldExportGroup) {
      if (group.parseUnknownHandles || group.pathName === 'NetworkGameplayTagNodeIndex') {
        group.netFieldExports[netField.handle] = {
          parseType: 'unknown',
          handle: netField.handle,
          name: netField.name,
          compatibleChecksum: netField.compatibleChecksum,
        };

        continue;
      }

      addToUnreadGroups(group, netField, globalData);

      continue;
    }

    const netFieldExport = netFieldExportGroup.properties[netField.name];

    if (!netFieldExport) {
      if (group.parseUnknownHandles || group.pathName === 'NetworkGameplayTagNodeIndex') {
        group.netFieldExports[netField.handle] = {
          parseType: 'unknown',
          handle: netField.handle,
          name: netField.name,
          compatibleChecksum: netField.compatibleChecksum,
        };

        continue;
      }

      addToUnreadGroups(group, netField, globalData);

      continue;
    }

    group.netFieldExports[netField.handle] = {
      handle: netField.handle,
      name: netField.name,
      compatibleChecksum: netField.compatibleChecksum,
      parseFunction: netFieldExport.parseFunction,
      customExportName: netFieldExport.customExportName,
      storeAsHandle: netFieldExport.storeAsHandle,
      parseType: netFieldExport.parseType,
      type: netFieldExport.type,
      bits: netFieldExport.bits,
      config: netFieldExport.config,
      enablePropertyChecksum: netFieldExport.enablePropertyChecksum,
    };
  }
};
