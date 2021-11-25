const fs = require('fs');
const pathhhh = require('path');
const DebugObject = require('../../../Classes/DebugObject');
const netFieldExports = require('../../../NetFieldExports');
const enums = require('../../../Enums');
const classes = require('../../../Classes');
const Replay = require('../../Classes/Replay');

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
}

const validateNetFieldExportProperty = (property, pathName, customClasses, customEnums) => {
  if (!property.name) {
    throw Error(`Invalid export: ${pathName} -> unknown has no name`);
  }

  switch (property.parseType) {
    case 'default':
      if (!property.parseFunction) {
        throw Error(`Invalid export: ${pathName} -> ${property.name} parseType 'default' requires a parseFunction`);
      }

      break;

    case 'readClass':
      if (!property.type) {
        throw Error(`Invalid export: ${pathName} -> ${property.name} parseType '${property.parseType}' requires a type`);
      }

      if (!classes[property.type] && !customClasses[property.type]) {
        throw Error(`Invalid export: ${pathName} -> ${property.name} class '${property.type}' does not exist`);
      }

      break;

    case 'readEnum':
      if (!property.type) {
        throw Error(`Invalid export: ${pathName} -> ${property.name} parseType 'readEnum' requires a type`);
      }

      if (!enums[property.type] && !customEnums[property.type]) {
        throw Error(`Invalid export: ${pathName} -> ${property.name} class '${property.type}' does not exist`);
      }

      if (!property.bits) {
        throw Error(`Invalid export: ${pathName} -> ${property.name} parseType 'readEnum' requires the amount of bits`);
      }

      break;

    case 'readDynamicArray':
    case 'ignore':
      break;

    default:
      throw Error(`Invalid export: ${pathName} -> ${property.name} has no/invalid parsetype`);
  }
};

class NetFieldParser {
  netFieldGroups = [];
  classNetCacheToNetFieldGroup = {};
  theClassCache = {};
  redirects = {};
  classPathCache = {};
  enumCache = {};
  informedError = {};

  constructor(globalData) {
    const handleExport = (fieldExport) => {
      if (fieldExport.parseLevel > globalData.parseLevel) {
        return;
      }

      fieldExport.path.forEach((path) => {
        const index = this.netFieldGroups.findIndex(([thePath]) => thePath === path);

        if (index !== -1) {
          this.netFieldGroups.splice(index, 1);
        }

        this.netFieldGroups.push([path, fieldExport]);
      })

      if (fieldExport.redirects) {
        fieldExport.redirects.forEach((path) => {
          this.redirects[path] = fieldExport.path[0];
        });
      }

      switch (fieldExport.type) {
        case 'ClassNetCache':
          break;

        default:
          Object.values(fieldExport.properties).forEach((property) => validateNetFieldExportProperty(property, fieldExport.path[0], globalData.customClasses, globalData.customEnums))
          break;
      }


      if (fieldExport.exportGroup) {
        if (!globalData.result[fieldExport.exportGroup]) {
          globalData.result[fieldExport.exportGroup] = {};
        }

        if (fieldExport.exportName) {
          if (!globalData.result[fieldExport.exportGroup][fieldExport.exportName]) {
            globalData.result[fieldExport.exportGroup][fieldExport.exportName] = getExportByType(fieldExport.exportType);
            globalData.states[fieldExport.exportName] = {};
          }
        }
      }
    };

    if (!globalData.onlyUseCustomNetFieldExports) {
      netFieldExports.forEach(handleExport);
    }

    if (globalData.customNetFieldExports) {
      globalData.customNetFieldExports.forEach(handleExport);
    }

    this.netFieldGroups.filter(([, { type }]) => type === 'ClassNetCache').forEach(([, { properties }]) => {
      Object.values(properties).forEach(({ type }) => {
        const theGroup = this.netFieldGroups.find(([path]) => path.includes(type));

        if (theGroup) {
          theGroup[1].isClassNetCacheProperty = true;
        }
      })
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
  setType(obj, exportt, exportGroup, netBitReader, globalData) {
    let data;

    if (exportGroup.parseUnknownHandles) {
      const size = netBitReader.getBitsLeft();

      data = new DebugObject(netBitReader.readBits(size), exportt, size, netBitReader.header);

      obj[exportt.handle] = data;

      return true;
    }

    theSwitch: switch (exportt.parseType) {
      case 'ignore':
        data = undefined;
        return false;

      case 'readClass':
        const theClass = globalData.customClasses[exportt.type] || classes[exportt.type];

        const dingens = new theClass();
        dingens.serialize(netBitReader, globalData, exportt.config || {});

        if (dingens.resolve) {
          dingens.resolve(globalData.netGuidCache, globalData);
        }

        data = dingens;
        break;

      case 'readDynamicArray':
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
              if (!this.informedError[`${exportGroup.pathName}:${exportt.name}:${handle}`]) {
                console.warn(`${exportGroup.pathName}'s property ${exportt.name} requires another property with handle ${handle}`);

                this.informedError[`${exportGroup.pathName}:${exportt.name}:${handle}`] = true;
              }

              netBitReader.skipBits(numBits);
              continue;
            }

            const archive = new Replay(netBitReader.readBits(numBits), numBits);

            archive.info = netBitReader.info;
            archive.header = netBitReader.header;

            if (isGroupType) {
              const temp = {};

              this.setType(temp, {
                ...exporttt,
                parseType: 'default'
              }, exportGroup, archive, globalData);

              newData = temp[exporttt.name];
            } else {
              const temp = {};

              if (exporttt.name === exportt.name) {
                this.setType(temp, {
                  ...exporttt,
                  parseType: 'readClass'
                }, exportGroup, archive, globalData);

                newData = temp[exporttt.name];
              } else {
                this.setType(temp, exporttt, exportGroup, archive, globalData);

                newData[exporttt.name] = temp[exporttt.name];
              }
            }
          }

          arr[index] = newData;
        }

        data = arr;
        break;

      case 'readEnum':
        const enumm = globalData.customEnums[exportt.type] || enums[exportt.type];

        if (!enumm) {
          data = null;
          break;
        }

        const value = netBitReader.readBitsToUnsignedInt(exportt.bits);

        data = enumm[value] || null;

        break;

      case 'default':
        data = netBitReader[exportt.parseFunction](...(exportt.args || []));
        break;
    }

    obj[exportt.name] = data;
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

  cleanForCheckpoint() {
    this.classNetCacheToNetFieldGroup = {};
    this.classPathCache = {};
  }
}

module.exports = NetFieldParser;
