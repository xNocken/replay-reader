import { NetFieldExport } from '../../../types/nfe';
import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';
import EEngineNetworkCustomVersion from '../../versions/EEngineNetworkCustomVersion';

export const readNFE = (archive: Replay, globalData: GlobalData) => {
  const isExported = archive.readByte();

  if (isExported) {
    const fieldExport: NetFieldExport = {
      name: '',
      handle: archive.readIntPacked(),
      compatibleChecksum: archive.readUInt32(),
    };

    if (globalData.customVersion.getEngineNetworkVersion() < EEngineNetworkCustomVersion.NetExportSerialization) {
      fieldExport.name = archive.readString();
      fieldExport.origType = archive.readString();
    } else if (globalData.customVersion.getEngineNetworkVersion() === EEngineNetworkCustomVersion.NetExportSerialization) {
      // env 9 seems to have had a bug that caused the name to not be stored at all
    } else {
      fieldExport.name = archive.readFNameByte();
    }

    return fieldExport;
  }

  return null;
};
