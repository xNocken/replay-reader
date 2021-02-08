const fs = require('fs');
const netGuidCache = require('../../utils/netGuidCache');

class NetFieldParser {
  netFieldGroups = {};
  classNetCacheToNetFieldGroup = {};

  constructor() {
    fs.readdirSync(`${module.path}/../../../NetFieldExports`).forEach((path) => {
      try {
        const fieldExport = JSON.parse(fs.readFileSync(`${module.path}/../../../NetFieldExports/${path}`));

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
      if (field && netExport[field.name] && netExport[field.name].parseFunction !== 'ignore') {
        exportGroup[field.name] = null;
      }
    });

    exportGroup.type = group.pathName.split('/').pop();

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

      case 'readDynamicArray':
        const count = netBitReader.readIntPacked();
        const arr = [];

        for (let i = 0; i < count; i++) {
          switch (netFieldInfo.type) {
            case 'float':
              arr.push(netBitReader.readFloat32());
              break;

            case 'int':
              arr.push(netBitReader.readInt32());
              break;

            case 'uint':
              arr.push(netBitReader.readUInt32());
              break;

            default:
              const theClass = require(`../../../Classes/${netFieldInfo.type}.js`);
              const dingens = new theClass();
              dingens.serialize(netBitReader);

              if (dingens.resolve) {
                dingens.resolve(netGuidCache);
              }

              arr.push(dingens);
              break;
          }
        }
        break;

      default:
        data = netBitReader[netFieldInfo.parseFunction]();
        break;
    }

    obj[netFieldInfo.name] = data;
  }

  tryGetClassNetCacheProperty(property, group) {
    const groupInfo = this.netFieldGroups[group];

    if (!groupInfo) {
      return false;
    }

    return groupInfo[property];
  }
}

module.exports = NetFieldParser;
