const readFieldHeader = (archive, group) => {
  if (archive.atEnd()) {
    return false;
  }

  const netFieldExportHandle = archive.readSerializedInt(Math.max(group.netFieldExportsLength, 2));
  const numPayloadBits = archive.readIntPacked();

  const outField = group.netFieldExports[netFieldExportHandle];

  if (archive.isError || !archive.canRead(numPayloadBits)) {
    return false;
  }

  return {
    numPayloadBits,
    outField,
  };
};

module.exports = readFieldHeader;
