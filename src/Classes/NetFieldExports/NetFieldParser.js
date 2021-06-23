const fs = require('fs');
const DebugObject = require('../../../Classes/DebugObject');
const netGuidCache = require('../../utils/netGuidCache');

class NetFieldParser {
  netFieldGroups = [];
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
            this.netFieldGroups.push([path, fieldExport]);
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
            this.netFieldGroups.push([path, fieldExport]);
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
    const exportt = this.netFieldGroups.find(([key, { partialPath }]) => {
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

  /**
   * @param {Replay} netBitReader
   */
  setType(obj, exportGroup, netFieldInfo, netBitReader, globalData, exportt) {
    let data;

    if (!netFieldInfo) {
      data = new DebugObject(netBitReader.readBits(netBitReader.getBitsLeft()), exportt);

      obj[exportt.handle] = data;

      return true;
    }

    theSwitch: switch (netFieldInfo.parseFunction) {
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
        const isGroupType = ['readFloat32', 'readInt32', 'readPackedInt', 'readUInt32'].includes(netFieldInfo.type);

        while (true) {
          let index = netBitReader.readIntPacked();

          if (index === 0) {
            break;
          }

          index--;

          if (index > count) {
            console.log('rip2');
            data = arr;

            break theSwitch;
          }

          let newData = [];

          if (isGroupType) {
            newData = this.createType(exportGroup);
          }

          while (true) {
            let handle = netBitReader.readIntPacked();

            if (handle === 0) {
              break;
            }

            handle--;

            const exporttt = exportGroup.netFieldExports[handle];
            const numBits = netBitReader.readIntPacked();

            if (numBits === 0) {
              continue;
            }

            if (!exporttt) {
              netBitReader.skip(numBits);
              continue;
            }

            netBitReader.addOffset(numBits);

            if (isGroupType) {
              const temp = {};

              this.setType(temp, exportGroup, {
                ...netFieldInfo,
                parseFunction: netFieldInfo.type,
              }, netBitReader, globalData, exporttt);

              newData = temp[netFieldInfo.name];
            } else {
              const temp = {};

              this.setType(temp, exportGroup, {
                ...netFieldInfo,
                parseFunction: 'readProperty',
              }, netBitReader, globalData, exporttt);

              newData = temp[netFieldInfo.name];
            }

            netBitReader.popOffset(numBits);
          }

          arr[index] = newData;
        }

        data = arr;
        break;

      default:
        data = netBitReader[netFieldInfo.parseFunction](...(netFieldInfo.args || []));
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
