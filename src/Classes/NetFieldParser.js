const pathhhh = require('path');
const DebugObject = require('../../Classes/DebugObject');
const netFieldExports = require('../../NetFieldExports');
const enums = require('../../Enums');
const classes = require('../../Classes');
const Replay = require('../Classes/Replay');
const NetFieldExportGroup = require('./NetFieldExportGroup');

const getExportByType = (type) => {
  switch (type) {
    case 'null':
      return null;

    case 'object':
      return {};

    case 'array':
    default:
      return [];
  }
};

const validateNetFieldExportProperty = (name, property, pathName, customClasses, customEnums) => {
  switch (property.parseType) {
    case 'default':
      if (!property.parseFunction) {
        throw Error(`Invalid export: ${pathName} -> ${name} parseType 'default' requires a parseFunction`);
      }

      if (!Replay.prototype[property.parseFunction]) {
        throw Error(`Invalid export: ${pathName} -> ${name} parse function ${property.parseFunction} does not exist`);
      }

      break;

    case 'readClass':
      if (!property.type) {
        throw Error(`Invalid export: ${pathName} -> ${name} parseType '${property.parseType}' requires a type`);
      }

      if (!classes[property.type] && !customClasses[property.type]) {
        throw Error(`Invalid export: ${pathName} -> ${name} class '${property.type}' does not exist`);
      }

      break;

    case 'readEnum':
      if (!property.type) {
        throw Error(`Invalid export: ${pathName} -> ${name} parseType 'readEnum' requires a type`);
      }

      if (!enums[property.type] && !customEnums[property.type]) {
        throw Error(`Invalid export: ${pathName} -> ${name} class '${property.type}' does not exist`);
      }

      if (!property.bits) {
        throw Error(`Invalid export: ${pathName} -> ${name} parseType 'readEnum' requires the amount of bits`);
      }

      break;

    case 'readDynamicArray':
    case 'ignore':
      break;

    default:
      throw Error(`Invalid export: ${pathName} -> ${name} has no/invalid parsetype`);
  }
};

class NetFieldParser {
  constructor(globalData) {
    this.netFieldGroups = [];
    this.redirects = {};
    this.classPathCache = {};

    const handleExport = (fieldExport) => {
      let path;

      if (fieldExport.parseLevel > globalData.parseLevel) {
        return;
      }

      const handlePath = (path) => {
        const index = this.netFieldGroups.findIndex(([thePath]) => thePath === path);

        if (index !== -1) {
          this.netFieldGroups.splice(index, 1);
        }

        this.netFieldGroups.push([path, fieldExport]);
      };

      if (typeof fieldExport.path === 'string') {
        handlePath(fieldExport.path);

        path = fieldExport.path;
      } else if (Array.isArray(fieldExport.path)) {
        fieldExport.path.forEach(handlePath);

        path = fieldExport.path[0];
      }

      if (fieldExport.redirects) {
        fieldExport.redirects.forEach((redirect) => {
          this.redirects[redirect] = path;
        });
      }

      switch (fieldExport.type) {
        case 'ClassNetCache':
          break;

        default:
          Object.entries(fieldExport.properties).forEach(([name, property]) => validateNetFieldExportProperty(
            name,
            property,
            path,
            globalData.customClasses,
            globalData.customEnums,
          ));

          break;
      }

      const createExport = (group, name, type) => {
        if (!globalData.result[group]) {
          globalData.result[group] = {};
        }

        if (!globalData.result[group][name]) {
          globalData.result[group][name] = getExportByType(type);
        }
      };

      if (fieldExport.exports) {
        if (Array.isArray(fieldExport.exports)) {
          fieldExport.exports.forEach((group) => {
            createExport(group.group, group.name, group.type);
          });
        } else {
          createExport(fieldExport.exports.group, fieldExport.exports.name, fieldExport.exports.type);
        }
      }

      if (fieldExport.states) {
        Object.entries(fieldExport.states).forEach(([name, type]) => {
          globalData.states[name] = getExportByType(type);
        });
      }

      if (fieldExport.staticActorIds) {
        const exportGroup = new NetFieldExportGroup();

        exportGroup.parseUnknownHandles = fieldExport.parseUnknownHandles;
        exportGroup.storeAsHandle = fieldExport.storeAsHandle;
        exportGroup.customExportName = fieldExport.customExportName;
        exportGroup.exportGroup = fieldExport.exportGroup;
        exportGroup.exportName = fieldExport.exportName;
        exportGroup.exportType = fieldExport.exportType;
        exportGroup.type = fieldExport.type;
        exportGroup.pathName = path;
        exportGroup.netFieldExports = [];
        exportGroup.pathNameIndex = null;
        exportGroup.netFieldExportsLength = 0;

        fieldExport.staticActorIds.forEach((id) => {
          globalData.netGuidCache.staticActorIdMap[id] = exportGroup;
        });

        if (typeof fieldExport.path === 'string') {
          globalData.netGuidCache.NetFieldExportGroupMap[fieldExport.path] = exportGroup;
        } else {
          fieldExport.path.forEach((path) => {
            globalData.netGuidCache.NetFieldExportGroupMap[path] = exportGroup;
          });
        }
      }
    };

    if (globalData.customNetFieldExports) {
      globalData.customNetFieldExports.forEach(handleExport);
    }

    if (!globalData.onlyUseCustomNetFieldExports) {
      netFieldExports.forEach(handleExport);
    }

    this.netFieldGroups.filter(([, { type }]) => type === 'ClassNetCache').forEach(([, { properties }]) => {
      Object.values(properties).forEach(({ type }) => {
        const theGroup = this.netFieldGroups.find(([path]) => path.includes(type));

        if (theGroup) {
          theGroup[1].isClassNetCacheProperty = true;
        }
      });
    });
  }

  willReadType(group) {
    return !!this.getNetFieldExport(group);
  }

  shouldBeImported(group) {
    return !!this.getNetFieldExport(group, true);
  }

  getNetFieldExport(group, allowClassNetCacheOwner = false) {
    if (this.classPathCache[group] !== undefined) {
      return this.classPathCache[group];
    }

    const exportt = this.netFieldGroups.find(([key, { partialPath, isClassNetCacheProperty }]) => {
      if (partialPath) {
        return group.includes(key);
      }

      if (allowClassNetCacheOwner && isClassNetCacheProperty) {
        return key.includes(group);
      }

      return key === group;
    });


    if (exportt) {
      this.classPathCache[group] = exportt[1];

      return exportt[1];
    } else {
      this.classPathCache[group] = false;
    }
  }

  createType(group) {
    const exportGroup = {};

    exportGroup.type = group.customExportName || pathhhh.basename(group.pathName);

    exportGroup.pathName = group.pathName;

    return exportGroup;
  }

  /**
   * @param {Replay} netBitReader
   */
  setType(obj, exportt, exportGroup, netBitReader, globalData, depth = 1) {
    let data;

    if (!exportt.parseType && exportGroup.parseUnknownHandles) {
      const size = netBitReader.getBitsLeft();

      data = new DebugObject(netBitReader.readBits(size), exportt, size, netBitReader.header);

      obj[exportt.handle] = data;

      return true;
    }

    theSwitch: switch (exportt.parseType) {
      case 'ignore': {
        data = undefined;
        return false;
      }

      case 'readClass': {
        const theClass = globalData.customClasses[exportt.type] || classes[exportt.type];

        const dingens = new theClass();
        dingens.serialize(netBitReader, globalData, exportt.config || {});

        if (dingens.resolve) {
          dingens.resolve(globalData.netGuidCache, globalData);
        }

        data = dingens;
        break;
      }

      case 'readDynamicArray': {
        const count = netBitReader.readIntPacked();
        const arr = [];
        const isGroupType = netBitReader[exportt.parseFunction];

        while (true) {
          let index = netBitReader.readIntPacked();

          if (index === 0) {
            break;
          }

          index--;

          if (index > count) {
            data = arr;

            break theSwitch;
          }

          let newData = [];

          if (!isGroupType) {
            newData = {};
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
              netBitReader.skipBits(numBits);

              continue;
            }

            const maxDepth = exportGroup.storeAsHandleMaxDepth || exporttt.storeAsHandleMaxDepth;
            const storeAsHandle = (exportGroup.storeAsHandle || exporttt.storeAsHandle)
              && (!maxDepth || depth <= maxDepth);

            const archive = new Replay(netBitReader.readBits(numBits), numBits);

            archive.info = netBitReader.info;
            archive.header = netBitReader.header;

            if (isGroupType) {
              const temp = {};

              this.setType(temp, {
                ...exporttt,
                parseType: 'default',
              }, exportGroup, archive, globalData, depth + 1);

              if (storeAsHandle) {
                newData = temp[exporttt.handle];
              } else {
                newData = temp[exporttt.name];
              }
            } else {
              const temp = {};

              if (exporttt.name === exportt.name) {
                this.setType(temp, {
                  ...exporttt,
                  parseType: 'readClass',
                }, exportGroup, archive, globalData, depth + 1);

                newData = temp[exporttt.name];

                if (storeAsHandle) {
                  newData = temp[exporttt.handle];
                } else {
                  newData = temp[exporttt.name];
                }
              } else {
                this.setType(temp, exporttt, exportGroup, archive, globalData, depth + 1);

                if (storeAsHandle) {
                  newData[exporttt.handle] = temp[exporttt.handle];
                } else {
                  newData[exporttt.name] = temp[exporttt.name];
                }
              }
            }
          }

          arr[index] = newData;
        }

        data = arr;
        break;
      }
      case 'readEnum': {
        const enumm = globalData.customEnums[exportt.type] || enums[exportt.type];

        if (!enumm) {
          data = null;
          break;
        }

        const value = netBitReader.readBitsToUnsignedInt(exportt.bits);

        data = enumm[value] || null;

        break;
      }

      case 'default': {
        data = netBitReader[exportt.parseFunction](...(exportt.args || []));
        break;
      }
    }

    const maxDepth = exportGroup.storeAsHandleMaxDepth || exportt.storeAsHandleMaxDepth;
    const storeAsHandle = (exportGroup.storeAsHandle || exportt.storeAsHandle)
      && (!maxDepth || depth <= maxDepth);

    if (storeAsHandle) {
      obj[exportt.handle] = data;
    } else {
      obj[exportt.name] = data;
    }
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
    return this.redirects[path];
  }

  cleanForCheckpoint() {
    this.classPathCache = {};
  }
}

module.exports = NetFieldParser;
