class NetFieldExportGroup {
  pathName;
  pathNameIndex;
  netFieldExportsLength;
  netFieldExports;

  isValidIndex(handle) {
    return handle >= 0 && handle < this.netFieldExportsLength;
  }
}

module.exports = NetFieldExportGroup;
