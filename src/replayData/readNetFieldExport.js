const Replay = require("../Classes/Replay");
const NetFieldExport = require("../Classes/NetFieldExports/NetFieldExport");

/**
 *
 * @param {Replay} archive
 */
const readNetFieldExport = (archive) => {
  const isExported = archive.readByte();

  if (isExported) {
    const fieldExport = {};
    fieldExport.handle = archive.readIntPacked();
    fieldExport.compatibleChecksum = archive.readUInt32();

    if (archive.header.EngineNetworkVersion < 9) {
      fieldExport.name = archive.readString();
      fieldExport.type = archive.readString();
    } else if (archive.header.EngineNetworkVersion < 10) {
      fieldExport.name = archive.readString();
    } else {
      fieldExport.name = archive.readFNameByte();
    }

    return fieldExport;
  }

  return null;
};

module.exports = readNetFieldExport;
