class NetFieldExportGroup {
  pathName;
  pathNameIndex;
  netFieldExportsLength;
  netFieldExports;

  isInvalidIndex(handle) {
    return handle >= 0 && handle < this.netFieldExportsLength;
  }
}

module.exports = NetFieldExportGroup;
