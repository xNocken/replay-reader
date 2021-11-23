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

interface Header {
  Magic: number,
  NetworkVersion: number,
  NetworkChecksum: number,
  EngineNetworkVersion: number,
  GameNetworkProtocolVersion: number,
  Guid: string,
  Major: number,
  Minor: number,
  Patch: number,
  Changelist: number,
  Branch: string,
  LevelNamesAndTimes: {
    [world: string]: number
  },
  Flags: number,
  gameSpecificData: string[],
}

interface Info {
  LengthInMs: number,
  NetworkVersion: number,
  Changelist: number,
  FriendlyName: string,
  Timestamp: Date,
  TotalDataSizeInBytes: number,
  IsLive: boolean,
  IsCompressed: boolean,
  IsEncrypted: boolean,
  EncryptionKey: number[],
  FileVersion: number,
}

interface Checkpoint {
  id: string,
  group: string,
  metadata: string,
  start: number,
  end: number,
  sizeInBytes: number,
  startpos: number,
  link?: string,
}

interface Event {
  id: string,
  group: string,
  metadata: string,
  start: number,
  end: number,
  length: number,
  startpos: number,
  link?: string,
}

interface DataChunk {
  start: number,
  end: number,
  length: number,
  startpos: number,
  link?: string,
}

interface Chunks {
  replayData: DataChunk[],
  checkpoints: Checkpoint[],
  events: Event[],
}

interface MetadataCheckpoint {
  Id: string,
  Group: string,
  Metadata: string,
  Time1: number,
  Time2: number,
  DownloadLink: string,
  FileSize: number,
}

interface PlayerElemEvent extends Event {
  eliminated: string,
  eliminator: string,
  gunType: string|number,
  knocked: boolean,
}

interface MatchStatsEvent extends Event {
  eliminated: string,
  eliminator: string,
  gunType: string|number,
  knocked: boolean
  accuracy: number,
  assists: number,
  eliminations: number,
  weaponDamage: number,
  otherDamage: number,
  revives: number,
  damageTaken: number,
  damageToStructures: number,
  materialsGathered: number,
  materialsUsed: number,
  totalTraveled: number,
  damageToPlayers: number,
}

interface MatchTeamStatsEvent extends Event {
  something: number,
  position: number,
  totalPlayers: number,
}

interface MetadataEvent {
  Id: string,
  Group: string,
  Metadata: string,
  Time1: number,
  Time2: number,
  DownloadLink: string,
  FileSize: number,
}

interface MetadataDataChunk {
  Id: string,
  Time1: number,
  Time2: number,
  SizeInBytes: number,
  DownloadLink: string,
  FileSize: number,
}

interface MetaDataResult {
  ReplayName: string,
  LengthInMS: number,
  NetworkVersion: number,
  Changelist: number,
  FriendlyName: string,
  Timestamp: string,
  bIsLive: boolean,
  bCompressed: boolean,
  DesiredDelayInSeconds: number,
  DownloadLink: string,
  FileSize: number,
  Checkpoints: MetadataCheckpoint[],
  Events: MetadataEvent[],
  DataChunks: MetadataDataChunk[],
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

type setFastForward = (time: number) => void;
type stopParsing = () => void;

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
  changedProperties: string[],
}

export interface NetDeltaExport {
  chIndex: number,
  data: NetDeltaExportData,
  timeSeconds: number,
  staticActorId?: string,
  globalData: GlobalData,
  result: Object,
  states: Object,
  setFastForward: setFastForward,
  stopParsing: setFastForward,
  changedProperties?: string[],
}

export interface PropertyExport {
  chIndex: number,
  data: Export,
  timeSeconds: number,
  staticActorId?: string,
  globalData: GlobalData,
  result: Object,
  states: Object,
  setFastForward: setFastForward,
  stopParsing: setFastForward,
  changedProperties: string[],
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
  setFastForward: setFastForward,
  stopParsing: setFastForward,
}

export interface ChannelOpenedClosed {
  chIndex: number,
  actor: any,
  globalData: GlobalData,
  result: Object,
  states: Object,
  setFastForward: setFastForward,
  stopParsing: setFastForward,
}

export interface NextChunk {
  size: number,
  type: number,
  chunk: PlayerElemEvent|MatchStatsEvent|MatchTeamStatsEvent|Event,
  chunks: Chunks,
  setFastForward: setFastForward,
  stopParsing: setFastForward,
}

export interface NextFrame {
  timeSeconds: number,
  globalData: GlobalData,
  result: Object,
  states: Object,
  setFastForward: setFastForward,
  stopParsing: stopParsing,
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
  on(event: 'nextFrame', listener: (exportt: NextFrame) => void): this,
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

export interface CustomClass {
  serialize(reader: Replay): void,
  resolve?(netGuidCache: NetGuidCache): void,
}

export interface parseOptions {
  parseLevel?: number,
  debug?: boolean,
  customNetFieldExports?: NetFieldExport[],
  onlyUseCustomNetFieldExports?: boolean,
  customClasses?: {
    [name: string]: CustomClass,
  },
  customEnums?: {
    [name: string]: Object,
  },
  additionalStates?: string[],
  handleEventEmitter?: handleEventEmitter,
  useCheckpoints?: boolean,
  fastForwardThreshold?: number,
  maxConcurrentDownloads?: number,
  maxConcurrentEventDownloads?: number,
  parseEvents?: boolean,
  parsePackets?: boolean,
}

interface Result {
  header: Header,
  info: Info,
  chunks: Chunks,
  events: (PlayerElemEvent|MatchStatsEvent|MatchTeamStatsEvent|Event)[],
  [exportGroup: string]: {
    [chIndex: number|string]: object,
  }
}

declare function parse(buffer: Buffer|MetaDataResult, options?: parseOptions): Promise<Result>;

export = parse;
