import Replay from "../src/Classes/Replay";

export type ParseFunctions = Exclude<keyof Replay, 'getBitsLeft' | 'atEnd' | 'canRead' | 'getByteOffset' | 'hasLevelStreamingFixes' | 'hasDeltaCheckpoints' | 'hasGameSpecificFrameData' | 'goToByte' | 'appendDataFromChecked' | 'decryptBuffer' | 'goTo' | 'buffer' | 'lastBit' | 'isError' | 'offset' | 'offsets' | 'float32Array' | 'uInt8Float32Array' | 'double64Array' | 'uInt8Double64Array' | 'header' | 'globalData' | 'UnrealNames' | 'constructor' | 'addOffset' | 'addOffsetByte' | 'popOffset' | 'resolveError' | 'getLastByte'>;

export type ParseTypes = 'readClass' | 'readDynamicArray' | 'readEnum' | 'ignore' | 'default' | 'unknown';
export type NetFieldExportTypes = 'classNetCache' | 'default';
export type NetFieldExportExportTypes = 'array' | 'object' | 'null';
export type ClassNetCacheExportTypes = 'function' | 'class' | 'netDeltaSerialize';
export type VersionMethods = 'equals' | 'greaterThan' | 'smallerThan' | 'greaterThanOrEqual' | 'smallerThanOrEqual';

type RemoveFromNFEProps<T> = Omit<T, 'parseType'>
type RemoveFromNFEGroups<T> = Omit<T, 'type' | 'properties'>

type OverrideConfig<T> = {
  versions: {
    method: VersionMethods,
    major?: number,
    minor?: number,
    networkVersion?: number,
    engineNetworkVersion?: number,
    changelist?: number,
  },
  settings: Omit<Partial<T>, 'versionOverrides' | 'parseType'>,
}

export interface NetFieldExportCacheConfigBase {
  parseType: ClassNetCacheExportTypes,
  type: string,
  enablePropertyChecksum?: boolean,
  customExportName?: string,
  versionOverrides?: OverrideConfig<NetFieldExportCacheConfigBase>[],
}

export interface NetFieldExportPropertyConfigBase {
  parseType: ParseTypes,
  customExportName?: string,
  storeAsHandle?: boolean,
  storeAsHandleMaxDepth?: number,
}

export interface NetFieldExportPropertyConfigDefault extends NetFieldExportPropertyConfigBase {
  parseType: 'default',
  parseFunction: ParseFunctions,
  versionOverrides?: OverrideConfig<NetFieldExportPropertyConfigDefault>[],
  args?: unknown[],
}

export interface NetFieldExportPropertyConfigArray extends NetFieldExportPropertyConfigBase {
  parseType: 'readDynamicArray',
  versionOverrides?: OverrideConfig<NetFieldExportPropertyConfigArray>[],
  type?: string,
  config?: object,
  parseFunction?: ParseFunctions,
}

export interface NetFieldExportPropertyConfigEnum extends NetFieldExportPropertyConfigBase {
  parseType: 'readEnum',
  type: string,
  bits: number,
  versionOverrides?: OverrideConfig<NetFieldExportPropertyConfigEnum>[],
}

export interface NetFieldExportPropertyConfigClass extends NetFieldExportPropertyConfigBase {
  parseType: 'readClass',
  type: string,
  versionOverrides?: OverrideConfig<NetFieldExportPropertyConfigClass>[],
  config?: object,
}

export interface NetFieldExportPropertyConfigIgnore {
  parseType: 'ignore',
}

export interface NetFieldExportPropertyConfigInternal extends
  RemoveFromNFEProps<NetFieldExportPropertyConfigDefault>,
  RemoveFromNFEProps<NetFieldExportPropertyConfigArray>,
  RemoveFromNFEProps<NetFieldExportPropertyConfigEnum>,
  RemoveFromNFEProps<NetFieldExportPropertyConfigClass>,
  RemoveFromNFEProps<NetFieldExportCacheConfigBase> {
  parseType: ParseTypes | ClassNetCacheExportTypes,
  type: string,
  parseFunction: ParseFunctions,
  versionOverrides?: OverrideConfig<NetFieldExportPropertyConfigInternal>[],
}

export type NetFieldExportPropertyConfig = NetFieldExportPropertyConfigDefault | NetFieldExportPropertyConfigArray | NetFieldExportPropertyConfigEnum | NetFieldExportPropertyConfigClass | NetFieldExportPropertyConfigIgnore;

export interface ExportConfig {
  name: string,
  group: string,
  type: NetFieldExportExportTypes,
}

interface NetFieldExportGroupConfigBase {
  exports?: ExportConfig,
  path: string[] | string,
  partialPath?: boolean,
  parseLevel?: number,
  states?: {
    [stateName: string]: string,
  },
}

export interface NetFieldExportGroupPropertyConfig extends NetFieldExportGroupConfigBase {
  type?: 'default',
  staticActorIds?: string[],
  customExportName?: string,
  parseUnknownHandles?: boolean,
  storeAsHandle?: boolean,
  storeAsHandleMaxDepth?: number,
  redirects?: string[],
  properties: {
    [name: string]: NetFieldExportPropertyConfig,
  },
}

export interface NetFieldExportGroupCacheConfig extends NetFieldExportGroupConfigBase {
  type: 'classNetCache',
  properties: {
    [name: string]: NetFieldExportCacheConfigBase,
  }
}

export interface NetFieldExportGroupConfigInternal extends
  RemoveFromNFEGroups<NetFieldExportGroupPropertyConfig>,
  RemoveFromNFEGroups<NetFieldExportGroupCacheConfig> {
  type: NetFieldExportTypes,
  properties: {
    [name: string]: NetFieldExportPropertyConfigInternal,
  },
  isClassNetCacheProperty: boolean,
}

export type NetFieldExportGroupConfig = NetFieldExportGroupPropertyConfig | NetFieldExportGroupCacheConfig;

export interface NetFieldExport {
  name: string,
  handle: number,
  compatibleChecksum: number,
  origType?: string,
}

export interface NetFieldExportGroup {
  pathName: string,
  pathNameIndex: number,
  netFieldExportsLength: number,
  properties?: Record<number, NetFieldExport>,
}

export interface NetFieldExportInternal extends NetFieldExport {
  parseType: ParseTypes | ClassNetCacheExportTypes,
  storeAsHandle?: boolean,
  storeAsHandleMaxDepth?: number,
  exportName: string,
  config?: unknown,
  type?: string,
  parseFunction?: ParseFunctions,
  bits?: number,
  args?: unknown[],
  enablePropertyChecksum?: boolean,
  incompatible?: boolean,
}

export interface NetFieldExportGroupInternal extends NetFieldExportGroup {
  type?: string,
  parseUnknownHandles?: boolean,
  storeAsHandle?: boolean,
  storeAsHandleMaxDepth?: number,
  netFieldExports: NetFieldExportInternal[],
  exportName: string,
}
