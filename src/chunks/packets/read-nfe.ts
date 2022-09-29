import { NetFieldExport } from '../../../types/replay';
import Replay from '../../Classes/Replay';

export const readNFE = (archive: Replay) => {
  const isExported = archive.readByte();

  if (isExported) {
    const fieldExport: NetFieldExport = {
      name: '',
      handle: archive.readIntPacked(),
      compatibleChecksum: archive.readUInt32(),
    };

    if (archive.header.engineNetworkVersion < 9) {
      fieldExport.name = archive.readString();
      fieldExport.origType = archive.readString();
    } else if (archive.header.engineNetworkVersion === 9) {
      // env 9 seems to have had a bug that caused the name to not be stored at all
    } else {
      fieldExport.name = archive.readFNameByte();
    }

    return fieldExport;
  }

  return null;
};
