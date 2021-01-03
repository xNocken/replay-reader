const NetBitReader = require("../Classes/NetBitReader");
const NetFieldExport = require("../Classes/NetFieldExports/NetFieldExport");

/**
 *
 * @param {NetBitReader} archive
 */
const readNetFieldExport = (archive) => {
  const isExported = archive.readBoolean8();

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
      fieldExport.name = archive.readFName();
    }

    return fieldExport;
  }

  return null;
};

module.exports = readNetFieldExport;
