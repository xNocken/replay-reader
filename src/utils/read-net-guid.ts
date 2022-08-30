import { NetworkGUID } from '../../Classes/NetworkGUID';
import GlobalData from '../Classes/GlobalData';
import Replay from '../Classes/Replay';
import { removePathPrefix } from './remove-path-prefix';

export const readNetGuid = (replay: Replay, isExportingNetGUIDBunch: boolean, globalData: GlobalData, internalLoadObjectRecursionCount = 0): NetworkGUID => {
  if (internalLoadObjectRecursionCount > 16) {
    return new NetworkGUID();
  }

  const netGuid = new NetworkGUID();

  netGuid.value = replay.readIntPacked();

  if (!netGuid.isValid()) {
    return netGuid;
  }

  if (netGuid.isDefault() || isExportingNetGUIDBunch) {
    const flags = replay.readByte();

    if ((flags & 1) === 1) {
      netGuid.outer = readNetGuid(replay, true, globalData, internalLoadObjectRecursionCount + 1);

      const pathName = replay.readString();

      if ((flags & 4) == 4) {
        netGuid.checksum = replay.readUInt32();
      }

      if (isExportingNetGUIDBunch) {
        const cleanedPath = removePathPrefix(pathName);

        netGuid.path = cleanedPath;
        netGuid.outer = globalData.netGuidCache.netGuids[netGuid.outer.value];

        globalData.netGuidCache.netGuids[netGuid.value] = netGuid;

        if (globalData.options.debug) {
          globalData.debugNetGuidToPathName.push(netGuid);
        }
      }

      return netGuid;
    }
  }

  return netGuid;
};
