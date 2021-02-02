const fs = require('fs');
const netGuidCache = require('../../utils/netGuidCache');

class NetFieldParser {
  netFieldGroups = {};

  constructor() {
    fs.readdirSync('NetFieldExports').forEach((path) => {
      try {
        const fieldExport = JSON.parse(fs.readFileSync(`NetFieldExports/${path}`));

        this.netFieldGroups[fieldExport.path] = fieldExport.properties;
      } catch (_) {
        console.log(`Error while loading ${path}`)
      }
    });
  }

  willReadType(group) {
    return !!this.netFieldGroups[group];
  }

  createType(group) {
    const exportGroup = {};

    let netExport = this.netFieldGroups[group.pathName];

    group.netFieldExports.forEach((field) => {
      if (field && netExport[field.name]) {
        exportGroup[field.name] = null;
      }
    });

    return exportGroup;
  }

  readField(obj, exportt, handle, exportGroup, netBitReader) {
    const netGroupInfo = this.netFieldGroups[exportGroup.pathName];

    if (!netGroupInfo) {
      return false;
    }

    const netFieldInfo = netGroupInfo[exportt.name];

    if (!netFieldInfo) {
      return false;
    }

    this.setType(obj, exportGroup, netFieldInfo, netBitReader);
  }

  setType(obj, exportGroup, netFieldInfo, netBitReader) {
    let data;

    switch (netFieldInfo.parseFunction) {
      case 'ignore':
        data = undefined;
        break;

      case 'readProperty':
        const theClass = require(`../../../Classes/${netFieldInfo.type}.js`);
        const dingens = new theClass();
        dingens.serialize(netBitReader);

        if (dingens.resolve) {
          dingens.resolve(netGuidCache);
        }

        data = dingens;
        break;

      default:
        data = netBitReader[netFieldInfo.parseFunction]();
        break;
    }

    obj[netFieldInfo.name] = data;
  }
}

module.exports = NetFieldParser;
