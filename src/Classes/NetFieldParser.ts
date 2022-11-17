import pathhhh from 'path';
import { DebugObject } from '../../Classes/DebugObject';
import netFieldExports from '../../NetFieldExports';
import Replay from '../Classes/Replay';
import GlobalData from './GlobalData';
import { BaseResult, BaseStates, CustomClass, CustomClassMap, CustomEnum, CustomEnumMap, Data } from '../../types/lib';
import { NetFieldExportPropertyConfigInternal, NetFieldExportGroupConfigInternal, NetFieldExportGroupInternal, NetFieldExportInternal, NetFieldExportGroupConfig } from '../../types/nfe';
import { StringToString } from '../../types/replay';
import Classes from '../../Classes';
import Enums from '../../Enums';

const getExportByType = (type: string) => {
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

const validateNetFieldExportProperty = (name: string, property: NetFieldExportPropertyConfigInternal, pathName: string, netFieldParser: NetFieldParser) => {
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

      if (!netFieldParser.getClass(property.type)) {
        throw Error(`Invalid export: ${pathName} -> ${name} class '${property.type}' does not exist`);
      }

      break;

    case 'readEnum':
      if (!property.type) {
        throw Error(`Invalid export: ${pathName} -> ${name} parseType 'readEnum' requires a type`);
      }

      if (!netFieldParser.getEnum(property.type)) {
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

export class NetFieldParser {
  /** contains all netFieldExportConfigs that are used for parsing */
  netFieldGroups: NetFieldExportGroupConfigInternal[] = [];
  netFieldGroupPaths: string[] = [];
  /** contains net field export paths indexed by the name used by the game */
  redirects: StringToString = {};
  /** maps the path to its classNetCache */
  classPathCache: Record<string, NetFieldExportGroupConfigInternal> = {};
  enums: CustomEnumMap = {};
  classes: CustomClassMap = {};

  getEnum(enumName: string): CustomEnum | undefined {
    return this.enums[enumName];
  }

  getClass(className: string): new () => CustomClass | undefined {
    return this.classes[className];
  }

  constructor(globalData: GlobalData) {
    Object.entries(Classes).forEach(([name, customClass]) => {
      this.classes[name] = customClass;
    });

    Object.entries(Enums).forEach(([name, customEnum]) => {
      this.enums[name] = customEnum;
    });

    Object.entries(globalData.options.customClasses).forEach(([name, customClass]) => {
      this.classes[name] = customClass;
    });

    Object.entries(globalData.options.customEnums).forEach(([name, customEnum]) => {
      this.enums[name] = customEnum;
    });

    const handleExport = (fieldExport: NetFieldExportGroupConfigInternal) => {
      let path: string;

      if (fieldExport.parseLevel > globalData.options.parseLevel) {
        globalData.logger.message(`Skipping export ${(fieldExport.path[0].length - 1) ? fieldExport.path : fieldExport.path[0]} because its parseLevel is too low`);

        return;
      }

      const handlePath = (path: string) => {
        const index = this.netFieldGroupPaths.findIndex((thePath) => thePath === path);

        if (index !== -1) {
          this.netFieldGroups.splice(index, 1);
          this.netFieldGroupPaths.splice(index, 1);
        }

        this.netFieldGroups.push(fieldExport);
        this.netFieldGroupPaths.push(path);
      };

      if (typeof fieldExport.path === 'string') {
        handlePath(fieldExport.path);

        path = fieldExport.path;
      } else if (Array.isArray(fieldExport.path)) {
        fieldExport.path.forEach(handlePath);

        path = fieldExport.path[0];
      }

      if (fieldExport.type !== 'classNetCache' && fieldExport.redirects) {
        fieldExport.redirects.forEach((redirect) => {
          this.redirects[redirect] = path;
        });
      }

      switch (fieldExport.type) {
        case 'classNetCache':
          break;

        default:
          Object.entries(fieldExport.properties).forEach(([name, property]) => validateNetFieldExportProperty(
            name,
            property,
            path,
            this,
          ));

          break;
      }

      const createExport = (group: keyof BaseResult, name: string, type: string) => {
        // this needs to be ignored because the base result has no default groups. the type will be defined by the user
        if (!globalData.result[group]) {
          // @ts-ignore
          globalData.result[group] = {};
        }

        // @ts-ignore
        if (!globalData.result[group][name]) {
          // @ts-ignore
          globalData.result[group][name] = getExportByType(type);
        }
      };

      if (fieldExport.exports) {
        if (Array.isArray(fieldExport.exports)) {
          fieldExport.exports.forEach((group) => {
            createExport(group.group, group.name, group.type);
          });
        } else {
          createExport(fieldExport.exports.group as keyof BaseResult, fieldExport.exports.name, fieldExport.exports.type);
        }
      }

      if (fieldExport.states) {
        Object.entries(fieldExport.states).forEach(([name, type]) => {
          globalData.states[<keyof BaseStates>name] = <BaseStates[keyof BaseStates]>getExportByType(type);
        });
      }

      if ((!fieldExport.type || fieldExport.type === 'default') && fieldExport.staticActorIds) {
        const exportGroup: NetFieldExportGroupInternal = {
          parseUnknownHandles: fieldExport.parseUnknownHandles,
          storeAsHandle: fieldExport.storeAsHandle,
          exportName: fieldExport.customExportName || pathhhh.basename(path),
          pathName: path,
          netFieldExports: [],
          pathNameIndex: null,
          netFieldExportsLength: 0,
        }

        fieldExport.staticActorIds.forEach((id) => {
          globalData.netGuidCache.addStaticActorId(id, exportGroup);
        });

        if (typeof fieldExport.path === 'string') {
          globalData.netGuidCache.netFieldExportGroupMap[fieldExport.path] = exportGroup;
        } else {
          fieldExport.path.forEach((path) => {
            globalData.netGuidCache.netFieldExportGroupMap[path] = exportGroup;
          });
        }
      }
    };

    if (globalData.options.customNetFieldExports) {
      // this cast is needed because else it would require a check for every property. this way it always has all properties and the check is done in the function
      (globalData.options.customNetFieldExports as NetFieldExportGroupConfigInternal[]).forEach(handleExport);
    }

    if (!globalData.options.onlyUseCustomNetFieldExports) {
      (<NetFieldExportGroupConfigInternal[]>netFieldExports).forEach(handleExport);
    }

    this.netFieldGroups.filter(({ type }) => type === 'classNetCache').forEach(({ properties }) => {
      Object.values(properties).forEach(({ type }) => {
        const groupIndex = this.netFieldGroupPaths.findIndex(([path]) => path.includes(type));
        const theGroup = this.netFieldGroups[groupIndex];

        if (theGroup) {
          theGroup.isClassNetCacheProperty = true;
        }
      });
    });
  }

  willReadType(group: string) {
    return !!this.getNetFieldExport(group);
  }

  shouldBeImported(group: string) {
    return !!this.getNetFieldExport(group, true);
  }

  getNetFieldExport(group: string, allowClassNetCacheOwner = false) {
    if (this.classPathCache[group] !== undefined) {
      return this.classPathCache[group];
    }

    const nfeIndex = this.netFieldGroupPaths.findIndex((key, index) => {
      const { partialPath, isClassNetCacheProperty } = this.netFieldGroups[index];
      if (partialPath) {
        return group.includes(key);
      }

      if (allowClassNetCacheOwner && isClassNetCacheProperty) {
        return key.includes(group);
      }

      return key === group;
    });

    const exportt = this.netFieldGroups[nfeIndex];

    if (exportt) {
      this.classPathCache[group] = exportt;

      return exportt;
    }

    this.classPathCache[group] = null;
  }

  createType(group: NetFieldExportGroupInternal): Data {
    return {
      type: group.exportName,
      pathName: group.pathName,
    };
  }

  /** Reads the current value */
  setType(
    propertyInfo: NetFieldExportInternal,
    exportGroup: NetFieldExportGroupInternal,
    netBitReader: Replay,
    globalData: GlobalData,
    depth = 1
  ): any {
    if (!propertyInfo.parseType && exportGroup.parseUnknownHandles) {
      const size = netBitReader.getBitsLeft();

      const data = new DebugObject();

      data.serialize(netBitReader, globalData, {});

      return data;
    }

    switch (propertyInfo.parseType) {
      case 'ignore':
        return null;

      case 'readClass': {
        const theClass = this.getClass(propertyInfo.type);

        const instance: CustomClass = new theClass();
        instance.serialize(netBitReader, globalData, propertyInfo.config || {});

        if (instance.resolve) {
          instance.resolve(globalData.netGuidCache, globalData);
        }

        return instance;
      }

      case 'readDynamicArray': {
        const count = netBitReader.readIntPacked();
        const arr: unknown[] = [];
        const isClassType = !netBitReader[propertyInfo.parseFunction];

        while (true) {
          let index = netBitReader.readIntPacked();

          if (index === 0) {
            break;
          }

          index--;

          if (index > count) {
            return arr;
          }

          let arrayData: any;

          while (true) {
            let handle = netBitReader.readIntPacked();

            if (handle === 0) {
              break;
            }

            handle--;

            const arrayEntryInfo = exportGroup.netFieldExports[handle];
            const numBits = netBitReader.readIntPacked();

            if (numBits === 0) {
              continue;
            }

            if (!arrayEntryInfo) {
              netBitReader.skipBits(numBits);

              continue;
            }

            const maxDepth = arrayEntryInfo.storeAsHandleMaxDepth !== undefined ? arrayEntryInfo.storeAsHandleMaxDepth : exportGroup.storeAsHandleMaxDepth;
            const storeAsHandle = (arrayEntryInfo.storeAsHandle || exportGroup.storeAsHandle)
              && (maxDepth === undefined || depth <= maxDepth);
            const propertyName = arrayEntryInfo.exportName;

            const archive = new Replay(netBitReader.readBits(numBits), globalData, numBits);

            archive.header = netBitReader.header;

            if (!isClassType) {
              arrayData = this.setType({
                ...arrayEntryInfo,
                parseType: 'default',
              }, exportGroup, archive, globalData, depth + 1);

              continue;
            }

            if (propertyName === propertyInfo.name) {
              arrayData = this.setType({
                ...arrayEntryInfo,
                parseType: 'readClass',
              }, exportGroup, archive, globalData, depth + 1);

              continue;
            }

            if (!arrayData) {
              arrayData = {};
            }

            const result = this.setType(arrayEntryInfo, exportGroup, archive, globalData, depth + 1);

            if (storeAsHandle) {
              arrayData[arrayEntryInfo.handle] = result;
            } else {
              arrayData[propertyName] = result;
            }
          }

          arr[index] = arrayData;
        }

        return arr;
      }

      case 'readEnum': {
        const enumm = this.getEnum(propertyInfo.type);

        if (!enumm) {
          return null;
        }

        const value = netBitReader.readBitsToUnsignedInt(propertyInfo.bits);

        return enumm[value] || null;
      }

      case 'default': {
        if (propertyInfo.args) {
          return netBitReader[propertyInfo.parseFunction].call(netBitReader, ...propertyInfo.args);
        }

        return netBitReader[propertyInfo.parseFunction].call(netBitReader);
      }
    }
  }

  getRedirect(path: string) {
    return this.redirects[path];
  }

  cleanForCheckpoint() {
    this.classPathCache = {};
  }
}
