const readFieldHeaderAndPayload = (archive, group) => {
  const netFieldExportHandle = archive.readSerializedInt(Math.max(group.netFieldExportsLength, 2))

  if (archive.isError) {
    return false;
  }

  const outField = group.netFieldExports[netFieldExportHandle];

  const numPayloadBits = archive.readIntPacked();

  if (archive.isError || !archive.canRead(numPayloadBits)) {
    return false;
  }

  return {
    netFieldExportHandle,
    numPayloadBits,
    outField,
  };
};

module.exports = readFieldHeaderAndPayload;
