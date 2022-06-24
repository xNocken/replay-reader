
const readNFE = (archive) => {
  const isExported = archive.readByte();

  if (isExported) {
    const fieldExport = {
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

module.exports = readNFE;
