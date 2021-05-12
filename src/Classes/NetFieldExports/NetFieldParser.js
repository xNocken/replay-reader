const fs = require('fs');
const DebugObject = require('../../../Classes/DebugObject');
const netGuidCache = require('../../utils/netGuidCache');

class NetFieldParser {
  netFieldGroups = {};
  classNetCacheToNetFieldGroup = {};
  theClassCache = {};
  redirects = {};

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

          if (fieldExport.redirects) {
            fieldExport.redirects.forEach((path) => {
              this.redirects[path] = fieldExport.path[0];
            });
          }
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

          if (fieldExport.redirects) {
            fieldExport.redirects.forEach((path) => {
              this.redirects[path] = fieldExport.path[0];
            });
          }
        } catch (err) {
          console.log(`Error while loading ${path}: "${err.message}"`)
        }
      });
    }
  }

  willReadType(group) {
    return !!this.getNetFieldExport(group);
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

    if (!netFieldInfo && !netGroupInfo.parseUnknownHandles) {
      return false;
    }

    return this.setType(obj, exportGroup, netFieldInfo, netBitReader, globalData, exportt);
  }

  setType(obj, exportGroup, netFieldInfo, netBitReader, globalData, exportt) {
    let data;

    if (!netFieldInfo) {
      data = new DebugObject(netBitReader.readBits(netBitReader.lastBit), exportt);

      obj[exportt.handle] = data;
      return true;
    }

    switch (netFieldInfo.parseFunction) {
      case 'ignore':
        data = undefined;
        return false;

      case 'readProperty':
        if (!this.theClassCache[netFieldInfo.type]) {
          let classPath;

          if (globalData.customClassPath) {
            classPath = `${process.cwd()}/${globalData.customClassPath}/${netFieldInfo.type}.js`;

            if (!fs.existsSync(`${process.cwd()}/${globalData.customClassPath}/${netFieldInfo.type}.js`)) {
              classPath = null;
            }
          }

          if (!classPath) {
            classPath = `../../../Classes/${netFieldInfo.type}.js`;
          }

          this.theClassCache[netFieldInfo.type] = require(classPath);
        }

        const theClass = this.theClassCache[netFieldInfo.type];

        const dingens = new theClass();
        dingens.serialize(netBitReader, globalData, netFieldInfo.config || {});

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
              if (!this.theClassCache[netFieldInfo.type]) {
                let classPath;

                if (globalData.customClassPath) {
                  classPath = `../../../${globalData.customClassPath}/${netFieldInfo.type}.js`;

                  if (!fs.existsSync(`${globalData.customClassPath}/${netFieldInfo.type}.js`)) {
                    classPath = null;
                  }
                }

                if (!classPath) {
                  classPath = `../../../Classes/${netFieldInfo.type}.js`;
                }

                this.theClassCache[netFieldInfo.type] = require(classPath);
              }

              const theClass = this.theClassCache[netFieldInfo.type];
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

    return groupInfo.properties[property];
  }

  getRedirect(path) {
    return this.redirects[path] || path;
  }
}

module.exports = NetFieldParser;
