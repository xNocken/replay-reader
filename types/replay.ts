import { NetworkGUID } from '../Classes/NetworkGUID';
import Replay from '../src/Classes/Replay';
import { Actor, ClassNetCacheExportTypes, ExternalData, NetFieldExportConfig, NetFieldExportGroupConfig, ParseFunctions, ParseTypes } from './lib';

export interface NetGuidMap {
  [key: number]: NetworkGUID,
}

export interface NetFieldExportGroup {
  pathName: string,
  pathNameIndex: number,
  netFieldExportsLength: number,
  properties?: {},
}

export interface NetFieldExportGroupInternal extends NetFieldExportGroup {
  type?: string,
  parseUnknownHandles?: boolean,
  storeAsHandle?: boolean,
  storeAsHandleMaxDepth?: number,
  netFieldExports: NetFieldExportInternal[],
  customExportName?: string,
}

export interface NetFieldExport {
  name: string,
  handle: number,
  compatibleChecksum: number,
  origType?: string,
}

export interface NetFieldExportInternal extends NetFieldExport {
  parseType: ParseTypes | ClassNetCacheExportTypes,
  parseUnknownHandles?: boolean,
  storeAsHandle?: boolean,
  storeAsHandleMaxDepth?: number,
  customExportName?: string,
  config?: unknown,
  type?: string,
  parseFunction?: ParseFunctions,
  bits?: number,
  args?: unknown[],
  enablePropertyChecksum?: boolean,
  incompatible?: boolean,
}

export interface Packet {
  size: number,
  state: number,
  timeSeconds: number,
  streamingFix?: number,
}

export interface NetFieldExportGroupMap {
  [key: string]: NetFieldExportGroup,
}

export interface NetFieldExportGroupInternalMap {
  [key: string]: NetFieldExportGroupInternal,
}

export interface StringToNumber {
  [key: string]: number,
}

export interface NumberToString {
  [key: number]: string,
}

export interface StringToString {
  [key: string]: string,
}

export interface ActorMap {
  [key: number]: Actor,
}

export interface NetFieldExportConfigMap {
  [key: string]: NetFieldExportConfig,
}

export interface NetFieldExportGroupConfigMap {
  [key: string]: NetFieldExportGroupConfig,
}

export interface ExternalDataMap {
  [key: number]: ExternalData,
}
