import EventEmitter from 'events';

import GlobalData from '../src/Classes/GlobalData';
import Replay from '../src/Classes/Replay';
import { NetGuidCache } from '../src/Classes/NetGuidCache';
import { NetFieldExportInternal } from '$types/replay';
import { NetworkGUID } from '../Classes/NetworkGUID';
import { Logger } from '../src/Classes/Logger';

export type ParseFunctions = 'readInt32' | 'readInt16' | 'readFloat32' | 'readBit' | 'readPackedVector100' | 'readRotationShort' | 'readIntPacked' | 'readUInt32' | 'readPackedVector10' | 'readByte' | 'readUInt16' | 'readString' | 'readVector' | 'readPackedVector1' | 'readFName' | 'readNetId';
export type ParseTypes = 'readClass' | 'readDynamicArray' | 'readEnum' | 'ignore' | 'default' | 'unknown';
export type NetFieldExportTypes = 'ClassNetCache' | 'Default';
export type NetFieldExportExportTypes = 'array' | 'object' | 'null';
export type SupportedEvents = 'playerElim' | 'AthenaReplayBrowserEvents' | 'ZoneUpdate' | 'CharacterSample' | 'ActorsPosition' | 'AdditionGFPEventGroup' | 'Timecode';
export type ClassNetCacheExportTypes = 'function' | 'class' | 'netDeltaSerialize';

type KnownKeys<T> = keyof {
  [K in keyof T as string extends K ? never : number extends K ? never : K]: never
};

export type RemoveIndex<T extends Record<any, any>> = Pick<T, KnownKeys<T>>;

export interface FVector {
  x: number;
  y: number;
  z: number;
}

export interface Vector4 {
  x: number;
  y: number;
  z: number;
  w: number;
}

export interface FRotator {
  pitch: number;
  yaw: number;
  roll: number;
}

export interface NumberToNumber {
  [key: number]: number;
}

export interface NumberToBoolean {
  [key: number]: boolean;
}

export interface Header {
  networkVersion: number,
  networkChecksum: number,
  engineNetworkVersion: number,
  gameNetworkProtocolVersion: number,
  guid?: string,
  major?: number,
  minor?: number,
  patch?: number,
  changelist?: number,
  branch?: string,
  levelNamesAndTimes?: ReadObjectResult,
  flags?: number,
  gameSpecificData?: string[],
  platform?: string,
}

export interface Meta {
  lengthInMs: number,
  networkVersion: number,
  changelist: number,
  friendlyName: string,
  timestamp: Date,
  isLive: boolean,
  isCompressed: boolean,
  isEncrypted: boolean,
  encryptionKey?: Buffer,
  fileVersion?: number,
}

export interface Checkpoint {
  id: string,
  group: string,
  metadata: string,
  link?: string,
  startTime: number,
  endTime: number,
  startPos: number,
  chunkSize: number,
}

export interface Event {
  id: string,
  group: string,
  metadata: string,
  startTime: number,
  endTime: number,
  startPos: number,
  chunkSize: number,
  link?: string,
}

export interface DataChunk {
  startTime: number,
  endTime: number,
  link?: string,
  startPos: number,
  chunkSize: number,
}

export interface Chunks {
  replayData: DataChunk[],
  checkpoints: Checkpoint[],
  events: Event[],
}

export interface PlayerElemEvent {
  eliminated: string,
  eliminator: string,
  gunType: string | number,
  knocked: boolean,
}

export interface MatchStatsEvent {
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
  placement: number,
  totalPlayers: number,
}

export interface GFPEvent {
  moduleId: string,
  moduleVersion?: number,
  artifactId?: string,
}

export interface MetadataCheckpoint {
  Id: string,
  Group: string,
  Metadata: string,
  Time1: number,
  Time2: number,
  DownloadLink: string,
  FileSize: number,
}

export interface MetadataEvent {
  Id: string,
  Group: string,
  Metadata: string,
  Time1: number,
  Time2: number,
  DownloadLink: string,
  FileSize: number,
}

export interface MetadataDataChunk {
  Id: string,
  Time1: number,
  Time2: number,
  SizeInBytes: number,
  DownloadLink: string,
  FileSize: number,
}

export interface MetaDataResult {
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
  archetype?: NetworkGUID;
  level?: NetworkGUID;
  location?: FVector;
  rotation?: FRotator;
  scale?: FVector;
  velocity?: FVector;
}

export interface Channel {
  chIndex: number;
  channelName: string;
  channelType: number;
  actor: Actor;
}

export interface ExternalData {
  netGuid: number,
  externalDataNumBits: number,
  handle: number,
  something: number,
  isEncrypted: number,
  payload: Uint8Array,
}

export interface SetFastForward {
  (time: number): void,
}

export interface StopParsing {
  (): void,
}

export interface Export {
  path: string,
  type: string,
  [properyName: string]: any,
}

export interface NetDeltaExportData<DataType> {
  deleted?: boolean,
  elementIndex: number,
  path: string,
  export: DataType,
  changedProperties: (keyof DataType)[],
}

export interface NetDeltaExport<ResultType extends BaseResult, StateType extends BaseStates, DataType> {
  chIndex: number,
  data: NetDeltaExportData<DataType>,
  timeSeconds: number,
  staticActorId?: string,
  globalData: GlobalData<ResultType>,
  result: ResultType,
  states: StateType,
  setFastForward: SetFastForward,
  stopParsing: StopParsing,
  actor: Actor,
  actorId: number,
  logger: Logger,
}

export interface PropertyExport<ResultType extends BaseResult, StateType extends BaseStates, DataType> {
  chIndex: number,
  data: DataType,
  timeSeconds: number,
  staticActorId?: string,
  globalData: GlobalData<ResultType>,
  result: ResultType,
  states: StateType,
  setFastForward: SetFastForward,
  stopParsing: StopParsing,
  changedProperties: (keyof DataType)[],
  actor: Actor,
  actorId: number,
  netFieldExports: NetFieldExportInternal[],
  logger: Logger,
}

export interface ActorDespawnExport<ResultType extends BaseResult, StateType extends BaseStates> {
  chIndex: number,
  openPacket: boolean,
  timeSeconds: number,
  staticActorId?: string,
  globalData: GlobalData<ResultType>,
  result: ResultType,
  states: StateType,
  netFieldExportGroup: any,
  setFastForward: SetFastForward,
  stopParsing: StopParsing,
  actor: Actor,
  actorId: number,
  logger: Logger,
}

export interface ActorSpawnExport<ResultType extends BaseResult, StateType extends BaseStates> {
  chIndex: number,
  openPacket: boolean,
  timeSeconds: number,
  staticActorId?: string,
  globalData: GlobalData<ResultType>,
  result: ResultType,
  states: StateType,
  netFieldExportGroup: any,
  setFastForward: SetFastForward,
  stopParsing: StopParsing,
  actor: Actor,
  actorId: number,
  logger: Logger,
}

export interface ChannelOpenedClosedExport<ResultType extends BaseResult, StateType extends BaseStates> {
  chIndex: number,
  actor: any,
  globalData: GlobalData<ResultType>,
  result: ResultType,
  states: StateType,
  setFastForward: SetFastForward,
  stopParsing: StopParsing,
  logger: Logger,
}

export interface NextChunkExport<ResultType extends BaseResult, StateType extends BaseStates> {
  size: number,
  globalData: GlobalData<ResultType>,
  result: ResultType,
  states: StateType,
  chunk: Event | Checkpoint | DataChunk,
  chunks: Chunks,
  setFastForward: SetFastForward,
  stopParsing: StopParsing,
  logger: Logger,
}

export interface NextFrameExport<ResultType extends BaseResult, StateType extends BaseStates> {
  timeSeconds: number,
  globalData: GlobalData<ResultType>,
  result: ResultType,
  states: StateType,
  setFastForward: SetFastForward,
  sinceLastFrame: number,
  stopParsing: StopParsing,
  logger: Logger,
}

export interface NetDeltaExportFunction<ResultType extends BaseResult, StateType extends BaseStates, DataType extends RemoveIndex<Data>> {
  (exportt: NetDeltaExport<ResultType, StateType, DataType>): void,
}

export interface PropertyExportFunction<ResultType extends BaseResult, StateType extends BaseStates, DataType extends RemoveIndex<Data>> {
  (exportt: PropertyExport<ResultType, StateType, DataType>): void,
}

export interface ActorDespawnExportFunction<ResultType extends BaseResult, StateType extends BaseStates> {
  (exportt: ActorDespawnExport<ResultType, StateType>): void,
}

export interface ActorSpawnExportFunction<ResultType extends BaseResult, StateType extends BaseStates> {
  (exportt: ActorSpawnExport<ResultType, StateType>): void,
}

export interface ChannelOpenedClosedFunction<ResultType extends BaseResult, StateType extends BaseStates> {
  (exportt: ChannelOpenedClosedExport<ResultType, StateType>): void,
}

export interface NextChunkFunction<ResultType extends BaseResult, StateType extends BaseStates> {
  (exportt: NextChunkExport<ResultType, StateType>): void,
}

export interface NextFrameFunction<ResultType extends BaseResult, StateType extends BaseStates> {
  (exportt: NextFrameExport<ResultType, StateType>): void,
}

export interface NetDeltaExportEmitter<ResultType extends BaseResult, StateType extends BaseStates> extends EventEmitter {
  on(event: string, listener: NetDeltaExportFunction<ResultType, StateType, RemoveIndex<Data>>): this,
}

export interface PropertyExportEmitter<ResultType extends BaseResult, StateType extends BaseStates> extends EventEmitter {
  on(event: string, listener: PropertyExportFunction<ResultType, StateType, RemoveIndex<Data>>): this,
}

export interface ActorDespawnEmitter<ResultType extends BaseResult, StateType extends BaseStates> extends EventEmitter {
  on(event: string, listener: ActorDespawnExportFunction<ResultType, StateType>): this,
}

export interface ActorSpawnEmitter<ResultType extends BaseResult, StateType extends BaseStates> extends EventEmitter {
  on(event: string, listener: ActorSpawnExportFunction<ResultType, StateType>): this,
}

export interface ParsingEmitter<ResultType extends BaseResult, StateType extends BaseStates> extends EventEmitter {
  on(event: 'channelOpened', listener: ChannelOpenedClosedFunction<ResultType, StateType>): this,
  on(event: 'channelClosed', listener: ChannelOpenedClosedFunction<ResultType, StateType>): this,
  on(event: 'nextChunk', listener: NextChunkFunction<ResultType, StateType>): this,
  on(event: 'nextFrame', listener: NextFrameFunction<ResultType, StateType>): this,
}

export interface SafeZone {
  x: number,
  y: number,
  z: number,
  radius: number,
}

export interface DeathInfo {
  id: string,
  reason: string,
  time: number,
}

export interface PlayerPosition {
  x: number,
  y: number,
  z: number,
  movementType?: string,
}

export interface PlayerPositionMap {
  [time: number]: PlayerPosition;
}

export interface PlayerKill {
  playerId: string,
  reason: string,
  knocked: boolean,
  location: FVector,
  time: number,
}

export interface Player {
  id: string,
  positions: PlayerPositionMap,
  killScore: number,
  kills: PlayerKill[],
  knockInfo?: DeathInfo,
  elimInfo?: DeathInfo,
}

export interface EventEmittersObject<ResultType extends BaseResult, StateType extends BaseStates> {
  properties: PropertyExportEmitter<ResultType, StateType>,
  netDelta: NetDeltaExportEmitter<ResultType, StateType>,
  actorSpawn: ActorSpawnEmitter<ResultType, StateType>,
  actorDespawn: ActorDespawnEmitter<ResultType, StateType>,
  parsing: ParsingEmitter<ResultType, StateType>,
}

export interface NetFieldExportConfig {
  parseType: ParseTypes | ClassNetCacheExportTypes,
  parseFunction?: ParseFunctions,
  customExportName?: string,
  type?: string,
  isFunction?: boolean,
  isCustomStruct?: boolean,
  bits?: number,
  config?: object,
  enablePropertyChecksum?: boolean,
}

export interface ExportConfig {
  name: string,
  group: string,
  type: NetFieldExportExportTypes,
}

export interface NetFieldExportGroupConfig {
  path: string[] | string,
  states?: {
    [stateName: string]: string,
  },
  exports?: ExportConfig,
  staticActorIds?: string[],
  customExportName?: string,
  parseUnknownHandles?: boolean,
  storeAsHandle?: boolean,
  storeAsHandleMaxDepth?: number,
  parseLevel?: number,
  parseUnkownHandles?: boolean,
  redirects?: string[],
  type?: NetFieldExportTypes,
  isClassNetCacheProperty?: boolean,
  partialPath?: boolean,
  properties: {
    [name: string]: NetFieldExportConfig,
  },
}

export interface Bunch {
  packetId: number,
  chIndex: number,
  chType: number,
  chName: string,
  chSequence: number,
  bOpen: boolean,
  bClose: boolean,
  bDormant: boolean,
  bIsReplicationPaused: boolean,
  bControl: boolean,
  bReliable: boolean,
  bPartial: boolean,
  bPartialInital: boolean,
  bPartialFinal: boolean,
  bHasPackageExportMaps: boolean,
  bHasMustBeMappedGUIDs: boolean,
  closeReason: number,
  timeSeconds: number,
  bunchDataBits: number,
  archive?: Replay,
  actor?: Actor,
}

export interface SetEvents<ResultType extends BaseResult, StateType extends BaseStates> {
  (emitters: EventEmittersObject<ResultType, StateType>, globalData: GlobalData<ResultType>): void,
}

export interface CustomClass<ResultType extends BaseResult> {
  serialize(reader: Replay, globalData: GlobalData<ResultType>, config?: unknown): void;
  resolve?(netGuidCache: NetGuidCache<ResultType>, globalData: GlobalData<ResultType>): void;
}

export interface CustomEnum {
  [number: number]: string,
}

export interface CustomClassMap<ResultType extends BaseResult> {
  [name: string]: new () => CustomClass<ResultType>,
}

export interface CustomEnumMap {
  [name: string]: CustomEnum,
}

export interface ParseOptions<ResultType extends BaseResult> {
  parseLevel?: number,
  debug?: boolean,
  customNetFieldExports?: NetFieldExportGroupConfig[],
  onlyUseCustomNetFieldExports?: boolean,
  customClasses?: CustomClassMap<ResultType>,
  customEnums?: CustomEnumMap,
  setEvents?: SetEvents<ResultType, BaseStates>,
  useCheckpoints?: boolean,
  fastForwardThreshold?: number,
  parseEvents?: boolean,
  parsePackets?: boolean,
  exportChunks?: boolean,
  enableActorToPath?: boolean,
}

export interface ParseStreamOptions<ResultType extends BaseResult> extends ParseOptions<ResultType> {
  maxConcurrentDownloads?: number,
  maxConcurrentEventDownloads?: number,
}

export interface Events {
  chests: FVector[],
  safeZones: SafeZone[],
  players: Player[],
  matchStats: MatchStatsEvent,
  gfp: GFPEvent[],
}

export interface GlobalDataEvents {
  chests: FVector[],
  safeZones: SafeZone[],
  players: {
    [id: string]: Player,
  },
  matchStats?: MatchStatsEvent,
  gfp?: GFPEvent[],
  timecode?: Date,
}

export interface ReplayParseFunction {
  (replay: Replay): unknown,
}

export interface ReadObjectResult {
  [key: string]: unknown,
}

export interface OodleDecompress {
  (inData: Uint8Array, inSize: number, outData: Uint8Array, outSize: number, fuzzSafe: number, checkCrc: number, verbosity: number, decBufBase: number, decBufSize: number, fpCallback: number, callbackUserData: number, decoderMemory: number, decoderMemorySize: number, threadPhase: number): number,
}

export interface OodleLib {
  OodleLZ_Decompress: OodleDecompress,
}

// TODO: find a way to remove pathName and type from later interfaces that extend this one
export interface Data {
  pathName?: string,
  type?: string,
  [key: string]: unknown,
}

export interface DataMap {
  [key: string]: unknown,
}

export interface BaseStates {
}

export interface BaseResult {
  header: Header,
  info: Meta,
  logs?: Logs,
  events?: Events,
  chunks?: Chunks,
}

export interface BaseExport {
  [key: string]: unknown,
}

export interface FortSet {
  BaseValue: number,
  CurrentValue: number,
  Maximum: number,
}

export interface DownloadedDataChunk {
  chunk: DataChunk,
  replay: Replay,
  downloadTime:  number,
}

export interface Logs {
  message: string[],
  warn: string[],
  error: string[],
}

export interface DownloadProcessResponse {
  url: string,
  body: number[],
  statusCode: number,
}