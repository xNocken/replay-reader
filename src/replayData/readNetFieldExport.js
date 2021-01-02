const NetBitReader = require("../Classes/NetBitReader");

/**
 *
 * @param {NetBitReader} archive
 */
const readNetFieldExport = (archive) => {
  const isExported = archive.readBoolean();

  if (isExported) {
    const fieldExport = new NetFieldExport();
    fieldExport.handle = archive.readIntPacked();
    fieldExport.compatibleChecksum = archive.readUInt32();

    if (archive.header.EngineNetworkVersion < 9) {
      fieldExport.name = archive.readString();
      fieldExport.type = archive.readString();
    } else if (archive.header.EngineNetworkVersion < 10) {
      fieldExport.name = archive.readString();
    } else {
      fieldExport.name = archive.readName();
    }

    return fieldExport;
  }

  return null;
};

module.exports = readNetFieldExport;
