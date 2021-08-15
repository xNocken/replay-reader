class NetFieldExportGroup {
  constructor() {
    this.pathName = '';
    this.pathNameIndex = 0;
    this.netFieldExportsLength = 0;
    this.netFieldExports = [];
  }

  isValidIndex(handle) {
    return handle >= 0 && handle < this.netFieldExportsLength;
  }
}

module.exports = NetFieldExportGroup;
