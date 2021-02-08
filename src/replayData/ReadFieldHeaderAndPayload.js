const NetBitReader = require("../Classes/NetBitReader");
const { netFieldParser } = require("../utils/globalData");

const readFieldHeaderAndPayload = (archive, group) => {
  if (archive.atEnd()) {
    return false;
  }

  const netFieldExportHandle = archive.readSerializedInt(Math.max(group.netFieldExportsLength, 2))

  if (archive.isError) {
    return false;
  }

  const outField = group.netFieldExports[netFieldExportHandle];

  const numPayloadBits = archive.readIntPacked();

  if (archive.isError || !archive.canRead(numPayloadBits)) {
    return false;
  }

  const reader = new NetBitReader(archive.readBits(numPayloadBits), numPayloadBits);

  reader.header = archive.header;
  reader.info = archive.info;

  if (archive.isError) {
    return false;
  }

  return {
    reader,
    outField,
  };
};

module.exports = readFieldHeaderAndPayload;
