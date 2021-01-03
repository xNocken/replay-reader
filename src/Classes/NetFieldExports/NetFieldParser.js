const fs = require('fs');

class NetFieldParser {
  netFieldGroups = {};

  constructor() {
    fs.readdirSync('classes').forEach((path) => {
      try {
        const fieldExport = JSON.parse(fs.readFileSync(`classes/${ path }`));

        this.netFieldGroups[fieldExport.path] = fieldExport.properties;
      } catch (_) {
        console.log(`Error while loading ${ path }`)
      }
    });
  }

  willReadType(group) {
    return !!this.netFieldGroups[group];
  }

  createType(group) {
    const exportGroup = {};

    group.netFieldExports.forEach((field) => {
      if (field) {
        exportGroup[field.name] = null;
      }
    });

    return exportGroup;
  }
}

module.exports = NetFieldParser;
