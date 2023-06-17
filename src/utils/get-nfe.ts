import { Header } from "../../types/lib";
import { NetFieldExportPropertyConfigInternal, VersionMethods } from "../../types/nfe";
import GlobalData from '../Classes/GlobalData';

const checkVersion = (currVer: number, targetVer: number, method: VersionMethods): boolean => {
  if (!targetVer) {
    return true;
  }

  switch (method) {
    case 'equals':
      return currVer === targetVer;
    case 'greaterThan':
      return currVer > targetVer;
    case 'greaterThanOrEqual':
      return currVer >= targetVer;
    case 'smallerThan':
      return currVer < targetVer;
    case 'smallerThanOrEqual':
      return currVer <= targetVer;
    default:
      throw new Error(`Invalid version method: ${method}`);
  }
};

export const getNfe = (nfe: NetFieldExportPropertyConfigInternal, globalData: GlobalData): NetFieldExportPropertyConfigInternal => {
  if (!nfe || !nfe.versionOverrides) {
    return nfe;
  }

  const result: NetFieldExportPropertyConfigInternal = {
    ...nfe,
    versionOverrides: undefined,
  };

  nfe.versionOverrides.forEach((override) => {
    const matches = checkVersion(globalData.header.major, override.versions.major, override.versions.method)
      && checkVersion(globalData.header.minor, override.versions.minor, override.versions.method)
      && checkVersion(globalData.customVersion.getNetworkVersion(), override.versions.networkVersion, override.versions.method)
      && checkVersion(globalData.customVersion.getEngineNetworkVersion(), override.versions.engineNetworkVersion, override.versions.method)
      && checkVersion(globalData.header.changelist, override.versions.changelist, override.versions.method);

    if (matches) {
      Object.assign(result, override.settings);
    }
  });

  return result;
}
