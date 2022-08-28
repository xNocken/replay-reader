import { NetFieldExport } from '$types/replay';
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
    } else if (archive.header.engineNetworkVersion < 10) {
      fieldExport.name = archive.readString();
    } else {
      fieldExport.name = archive.readFNameByte();
    }

    return fieldExport;
  }

  return null;
};
