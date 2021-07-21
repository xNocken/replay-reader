class NetFieldExportGroup {
  pathName = '';
  pathNameIndex = 0;
  netFieldExportsLength = 0;
  netFieldExports = {};

  isValidIndex(handle) {
    return handle >= 0 && handle < this.netFieldExportsLength;
  }
}

module.exports = NetFieldExportGroup;
