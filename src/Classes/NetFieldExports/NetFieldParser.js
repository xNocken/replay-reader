const fs = require('fs');
const netGuidCache = require('../../utils/netGuidCache');

class NetFieldParser {
  netFieldGroups = {};
  classNetCacheToNetFieldGroup = {};
  theClassCache = {};

  constructor(globalData) {
    if (!globalData.onlyUseCustomNetFieldExports) {
      fs.readdirSync(`${module.path}/../../../NetFieldExports`).forEach((path) => {
        try {
          const fieldExport = JSON.parse(fs.readFileSync(`${module.path}/../../../NetFieldExports/${path}`));

          if (fieldExport.parseLevel > globalData.parseLevel) {
            return;
          }
          fieldExport.path.forEach((path) => {
            this.netFieldGroups[path] = fieldExport;
          })
        } catch (err) {
          console.log(`Error while loading ${path}: "${err.message}"`)
        }
      });
    }

    if (globalData.netFieldExportPath) {
      fs.readdirSync(globalData.netFieldExportPath).forEach((path) => {
        try {
          const fieldExport = JSON.parse(fs.readFileSync(`${globalData.netFieldExportPath}/${path}`));

          if (fieldExport.parseLevel > globalData.parseLevel) {
            return;
          }

          fieldExport.path.forEach((path) => {
            this.netFieldGroups[path] = fieldExport;
          })
        } catch (err) {
          console.log(`Error while loading ${path}: "${err.message}"`)
        }
      });
    }
  }

  willReadType(group) {
    return !!this.getNetFieldExport(group)
  }

  getNetFieldExport(group) {
    const exportt = Object.entries(this.netFieldGroups).find(([key, { partialPath }]) => {
      if (partialPath) {
        return group.includes(key);
      }

      return key === group;
    });

    if (exportt) {
      return exportt[1];
    }
  }

  createType(group) {
    const exportGroup = {};

    let netExport = this.getNetFieldExport(group.pathName);

    group.netFieldExports.forEach((field) => {
      if (field && netExport.properties[field.name] && netExport.properties[field.name].parseFunction !== 'ignore') {
        exportGroup[field.name] = null;
      }
    });

    exportGroup.type = netExport.customExportName || group.pathName.split('/').pop();

    exportGroup.pathName = group.pathName;

    return exportGroup;
  }

  readField(obj, exportt, handle, exportGroup, netBitReader, globalData) {
    const netGroupInfo = this.getNetFieldExport(exportGroup.pathName);

    if (!netGroupInfo) {
      return false;
    }

    const netFieldInfo = netGroupInfo.properties[exportt.name];

    if (!netFieldInfo) {
      return false;
    }

    return this.setType(obj, exportGroup, netFieldInfo, netBitReader, globalData);
  }

  setType(obj, exportGroup, netFieldInfo, netBitReader, globalData) {
    let data;

    switch (netFieldInfo.parseFunction) {
      case 'ignore':
        data = undefined;
        return false;

      case 'readProperty':
        if (!this.theClassCache[netFieldInfo.type]) {
          this.theClassCache[netFieldInfo.type] = require(`../../../Classes/${netFieldInfo.type}.js`);
        }

        const theClass = this.theClassCache[netFieldInfo.type];

        const dingens = new theClass();
        dingens.serialize(netBitReader, globalData);

        if (dingens.resolve) {
          dingens.resolve(netGuidCache, globalData);
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
    return true;
  }

  tryGetClassNetCacheProperty(property, group) {
    const groupInfo = this.getNetFieldExport(group);

    if (!groupInfo) {
      return false;
    }

    return groupInfo[property];
  }
}

module.exports = NetFieldParser;
