declare module 'fortnite-replay-parser';

import EventEmitter from 'events';

type ParseFunctions = 'readInt32' | 'readInt16' | 'readFloat32' | 'readBit' | 'readPackedVector100' | 'readRotationShort' | 'readIntPacked' | 'readUInt32' | 'readPackedVector10' | 'readByte' | 'readUInt16';
type ParseTypes = 'readClass' | 'readDynamicArray' | 'readEnum' | 'ignore' | 'default';
type NetFieldExportTypes = 'ClassNetCache' | 'Default';
type NetFieldExportExportTypes = 'array' | 'object' | 'null';

interface FVector {
  x: number;
  y: number;
  z: number;
}

interface FRotator {
  pitch: number;
  yaw: number;
  roll: number;
}

interface NetworkGUID {
  value: number;

  isValid(): boolean;
  isDynamic(): boolean;
  isDefault(): boolean;
}

interface Actor {
  actorNetGUID: NetworkGUID;
  archetype: NetworkGUID;
  level: NetworkGUID;
  location: FVector;
  rotation: FRotator;
  scale: FVector;
  velocity: FVector;
}

interface Channel {
  channelName: string;
  channelIndex: number;
  channelType: number;
  actor: Actor;
}

interface ExternalData {
  netGuid: number,
  externalDataNumBits: number,
  handle: number,
  something1: number,
  something2: number,
  payload: Buffer,
}

interface GlobalData {
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

interface Export {
  path: string,
  type: string,
  [properyName: string]: any,
}

interface NetDeltaExportData {
  deleted?: boolean,
  elementIndex: number,
  path: string,
  export: Export,
}

interface NetDeltaExport {
  chIndex: number,
  data: NetDeltaExportData,
  timeSeconds: number,
  staticActorId?: string,
  globalData: GlobalData,
  result: Object,
  states: Object,
}

interface PropertyExport {
  chIndex: number,
  data: Export,
  timeSeconds: number,
  staticActorId?: string,
  globalData: GlobalData,
  result: Object,
  states: Object,
}

interface ActorDespawnExport {
  chIndex: number,
  openPacket: boolean,
  timeSeconds: number,
  staticActorId?: string,
  globalData: GlobalData,
  result: Object,
  states: Object,
  netFieldExportGroup: any,
}

interface ChannelOpenedClosed {
  chIndex: number,
  actor: any,
  globalData: GlobalData,
  result: Object,
  states: Object,
}

interface NextChunk {
  size: number,
  type: number,
}

interface NetDeltaExportEmitter extends EventEmitter {
  on(event: string, listener: (exportt: NetDeltaExport) => void): this,
}

interface PropertyExportEmitter extends EventEmitter {
  on(event: string, listener: (exportt: PropertyExport) => void): this,
}

interface ActorDespawnEmitter extends EventEmitter {
  on(event: string, listener: (exportt: ActorDespawnExport) => void): this,
}

interface ParsingEmitter extends EventEmitter {
  on(event: 'channelOpened', listener: (exportt: ChannelOpenedClosed) => void): this,
  on(event: 'channelClosed', listener: (exportt: ChannelOpenedClosed) => void): this,
  on(event: 'nextChunk', listener: (exportt: NextChunk) => void): this,
}

interface EventEmittersObject {
  propertyExportEmitter: PropertyExportEmitter,
  actorDespawnEmitter: ActorDespawnEmitter,
  netDeltaReadEmitter: NetDeltaExportEmitter,
  parsingEmitter: ParsingEmitter,
}

interface NetFieldExportProperty {
  name: string,
  parseFunction: ParseFunctions,
  parseType: ParseTypes,
  type?: string,
  isFunction?: boolean,
  isCustomStruct?: boolean,
  bits?: number,
  config?: object,
}

interface NetFieldExport {
  path: string[],
  exportName: string,
  exportGroup: string,
  exportType: NetFieldExportExportTypes,
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

interface parseOptions {
  parseLevel?: number,
  debug?: boolean,
  customNetFieldExports?: NetFieldExport[],
  onlyUseCustomNetFieldExports?: boolean,
  customClassPath?: string,
  customEnumPath?: string,
  handleEventEmitter: handleEventEmitter,
}

declare function parse(buffer: Buffer, options?: parseOptions): Promise<object>;

export = parse;
