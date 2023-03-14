import { NetFieldExport, NetFieldExportGroup, NetFieldExportGroupInternal } from '../../../types/nfe';
import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';
import { getNfe } from '../../utils/get-nfe';

import { readNFE } from '../packets/read-nfe';

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

export const readNetFieldExportGroup = (replay: Replay, globalData: GlobalData) => {
  const theGroup: NetFieldExportGroup = {
    pathName: replay.readString(),
    pathNameIndex: replay.readIntPacked(),
    netFieldExportsLength: replay.readIntPacked(),
  };

  const group = globalData.netGuidCache.addToExportGroupMap(theGroup.pathName, theGroup, globalData);

  for (let i = 0; i < group.netFieldExportsLength; i++) {
    const netField: NetFieldExport = readNFE(replay, globalData);

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
          exportName: netField.name,
        };

        continue;
      }

      addToUnreadGroups(group, netField, globalData);

      continue;
    }

    const netFieldExport = getNfe(netFieldExportGroup.properties[netField.name], globalData.header);

    if (!netFieldExport) {
      if (group.parseUnknownHandles || group.pathName === 'NetworkGameplayTagNodeIndex') {
        group.netFieldExports[netField.handle] = {
          parseType: 'unknown',
          handle: netField.handle,
          name: netField.name,
          compatibleChecksum: netField.compatibleChecksum,
          exportName: netField.name,
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
      exportName: netFieldExport.customExportName || netField.name,
      storeAsHandle: netFieldExport.storeAsHandle,
      storeAsHandleMaxDepth: netFieldExport.storeAsHandleMaxDepth,
      enablePropertyChecksum: netFieldExport.enablePropertyChecksum,
      args: netFieldExport.args,
      parseType: netFieldExport.parseType,
      type: netFieldExport.type,
      bits: netFieldExport.bits,
      config: netFieldExport.config,
    };
  }

  return group;
};
