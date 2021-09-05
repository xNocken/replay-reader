declare module 'fortnite-replay-parser';

import EventEmitter from 'events';

type ParseFunctions = 'readInt32' | 'readInt16' | 'readFloat32' | 'readBit' | 'readPackedVector100' | 'readRotationShort' | 'readIntPacked' | 'readUInt32' | 'readPackedVector10' | 'readByte' | 'readUInt16';
type ParseTypes = 'readClass' | 'readDynamicArray' | 'readEnum' | 'ignore' | 'default';
type NetFieldExportTypes = 'ClassNetCache' | 'Default';
type NetFieldExportExportTypes = 'array' | 'object' | 'null';

export interface FVector {
  x: number;
  y: number;
  z: number;
}

export interface FRotator {
  pitch: number;
  yaw: number;
  roll: number;
}

export interface NetworkGUID {
  value: number;

  isValid(): boolean;
  isDynamic(): boolean;
  isDefault(): boolean;
}

export interface Actor {
  actorNetGUID: NetworkGUID;
  archetype: NetworkGUID;
  level: NetworkGUID;
  location: FVector;
  rotation: FRotator;
  scale: FVector;
  velocity: FVector;
}

export interface Channel {
  channelName: string;
  channelIndex: number;
  channelType: number;
  actor: Actor;
}

export interface ExternalData {
  netGuid: number,
  externalDataNumBits: number,
  handle: number,
  something1: number,
  something2: number,
  payload: Buffer,
}

export interface GlobalData {
  channels: Channel[];

  actorToChannel: {
    [actorNetGUID: number]: number,
  };
  channelToActor: {
    [chIndex: number]: number,
  };
  externalData: {
    [actorNetGUID: number]: ExternalData,
  };

  debug: boolean;
  ignoredChannels: number[];

  result: Object;
  states: Object;
  parseLevel: number;

  netGuidCache: any; // TODO
  netFieldParser: any; // TODO
}

export interface Export {
  path: string,
  type: string,
  [properyName: string]: any,
}

export interface NetDeltaExportData {
  deleted?: boolean,
  elementIndex: number,
  path: string,
  export: Export,
}

export interface NetDeltaExport {
  chIndex: number,
  data: NetDeltaExportData,
  timeSeconds: number,
  staticActorId?: string,
  globalData: GlobalData,
  result: Object,
  states: Object,
}

export interface PropertyExport {
  chIndex: number,
  data: Export,
  timeSeconds: number,
  staticActorId?: string,
  globalData: GlobalData,
  result: Object,
  states: Object,
}

export interface ActorDespawnExport {
  chIndex: number,
  openPacket: boolean,
  timeSeconds: number,
  staticActorId?: string,
  globalData: GlobalData,
  result: Object,
  states: Object,
  netFieldExportGroup: any,
}

export interface ChannelOpenedClosed {
  chIndex: number,
  actor: any,
  globalData: GlobalData,
  result: Object,
  states: Object,
}

export interface NextChunk {
  size: number,
  type: number,
}

export interface NetDeltaExportEmitter extends EventEmitter {
  on(event: string, listener: (exportt: NetDeltaExport) => void): this,
}

export interface PropertyExportEmitter extends EventEmitter {
  on(event: string, listener: (exportt: PropertyExport) => void): this,
}

export interface ActorDespawnEmitter extends EventEmitter {
  on(event: string, listener: (exportt: ActorDespawnExport) => void): this,
}

export interface ParsingEmitter extends EventEmitter {
  on(event: 'channelOpened', listener: (exportt: ChannelOpenedClosed) => void): this,
  on(event: 'channelClosed', listener: (exportt: ChannelOpenedClosed) => void): this,
  on(event: 'nextChunk', listener: (exportt: NextChunk) => void): this,
}

export interface EventEmittersObject {
  propertyExportEmitter: PropertyExportEmitter,
  actorDespawnEmitter: ActorDespawnEmitter,
  netDeltaReadEmitter: NetDeltaExportEmitter,
  parsingEmitter: ParsingEmitter,
}

export interface NetFieldExportProperty {
  name: string,
  parseFunction: ParseFunctions,
  parseType: ParseTypes,
  type?: string,
  isFunction?: boolean,
  isCustomStruct?: boolean,
  bits?: number,
  config?: object,
}

export interface NetFieldExport {
  path: string[],
  exportName: string,
  exportGroup: string,
  exportType: NetFieldExportExportTypes,
  staticActorIds?: string[],
  customExportName?: string,
  parseLevel: number,
  parseUnkownHandles?: boolean,
  redirects?: string[],
  type: NetFieldExportTypes,
  properties: {
    [name: string]: NetFieldExportProperty,
  },
}

type handleEventEmitter = (emitters: EventEmittersObject) => void;

export interface parseOptions {
  parseLevel?: number,
  debug?: boolean,
  customNetFieldExports?: NetFieldExport[],
  onlyUseCustomNetFieldExports?: boolean,
  customClassPath?: string,
  customEnumPath?: string,
  additionalStates?: string[],
  handleEventEmitter: handleEventEmitter,
}

declare function parse(buffer: Buffer, options?: parseOptions): Promise<object>;

export = parse;
