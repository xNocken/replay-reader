import EventEmitter from 'events';

import GlobalData from '../src/Classes/GlobalData';
import Replay from '../src/Classes/Replay';
import { NetGuidCache } from '../src/Classes/NetGuidCache';
import { NetworkGUID } from '../Classes/NetworkGUID';
import { Logger } from '../src/Classes/Logger';
import { Events } from './events';
import { NetFieldExportGroupConfig, NetFieldExportInternal } from './nfe';

export type SupportedEvents = 'playerElim' | 'AthenaReplayBrowserEvents' | 'ZoneUpdate' | 'CharacterSample' | 'ActorsPosition' | 'AdditionGFPEventGroup' | 'Timecode' | 'PlayerStateEncryptionKey';

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
  levelNamesAndTimes?: ReadObjectResult<number>,
  flags?: number,
  gameSpecificData?: string[],
  fileVersionUE4?: number,
  fileVersionUE5?: number,
  packageVersionLicenseeUe?: number,
  minRecordHz: number,
  maxRecordHz: number,
  frameLimitInMS: number,
  checkpointLimitInMS: number,
  platform?: string,
  buildConfig: number,
  buildTargetType: string,
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
  globalData: GlobalData,
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
  globalData: GlobalData,
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

export interface FunctionCall<ResultType extends BaseResult, StateType extends BaseStates, DataType> {
  chIndex: number,
  hasData: boolean,
  data: DataType extends null ? null : DataType,
  timeSeconds: number,
  staticActorId?: string,
  globalData: GlobalData,
  result: ResultType,
  states: StateType,
  setFastForward: SetFastForward,
  stopParsing: StopParsing,
  changedProperties: DataType extends null ? null : (keyof DataType)[],
  actor: Actor,
  actorId: number,
  netFieldExports: DataType extends null ? null : NetFieldExportInternal[],
  logger: Logger,
}

export interface ActorDespawnExport<ResultType extends BaseResult, StateType extends BaseStates> {
  chIndex: number,
  openPacket: boolean,
  timeSeconds: number,
  staticActorId?: string,
  globalData: GlobalData,
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
  globalData: GlobalData,
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
  globalData: GlobalData,
  result: ResultType,
  states: StateType,
  setFastForward: SetFastForward,
  stopParsing: StopParsing,
  logger: Logger,
}

export interface NextChunkExport<ResultType extends BaseResult, StateType extends BaseStates> {
  size: number,
  globalData: GlobalData,
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
  globalData: GlobalData,
  result: ResultType,
  states: StateType,
  setFastForward: SetFastForward,
  sinceLastFrame: number,
  stopParsing: StopParsing,
  logger: Logger,
}

export interface FinishedExport<ResultType extends BaseResult, StateType extends BaseStates> {
  globalData: GlobalData,
  result: ResultType,
  states: StateType,
  logger: Logger,
}

export interface NetDeltaExportFunction<ResultType extends BaseResult, StateType extends BaseStates, DataType extends RemoveIndex<Data>> {
  (exportt: NetDeltaExport<ResultType, StateType, DataType>): void,
}

export interface PropertyExportFunction<ResultType extends BaseResult, StateType extends BaseStates, DataType extends RemoveIndex<Data>> {
  (exportt: PropertyExport<ResultType, StateType, DataType>): void,
}

export interface FunctionCallFunction<ResultType extends BaseResult, StateType extends BaseStates, DataType extends RemoveIndex<Data> = null> {
  (exportt: FunctionCall<ResultType, StateType, DataType>): void,
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

export interface FinishedFunction<ResultType extends BaseResult, StateType extends BaseStates> {
  (exportt: FinishedExport<ResultType, StateType>): void,
}

export interface NetDeltaExportEmitter<ResultType extends BaseResult, StateType extends BaseStates> extends EventEmitter {
  on(event: string, listener: NetDeltaExportFunction<ResultType, StateType, RemoveIndex<Data>>): this,
  once(event: string, listener: NetDeltaExportFunction<ResultType, StateType, RemoveIndex<Data>>): this,
}

export interface PropertyExportEmitter<ResultType extends BaseResult, StateType extends BaseStates> extends EventEmitter {
  on(event: string, listener: PropertyExportFunction<ResultType, StateType, RemoveIndex<Data>>): this,
  once(event: string, listener: PropertyExportFunction<ResultType, StateType, RemoveIndex<Data>>): this,
}

export interface FunctionCallEmitter<ResultType extends BaseResult, StateType extends BaseStates> extends EventEmitter {
  on(event: string, listener: FunctionCallFunction<ResultType, StateType, any>): this,
  once(event: string, listener: FunctionCallFunction<ResultType, StateType, any>): this,
}

export interface ActorDespawnEmitter<ResultType extends BaseResult, StateType extends BaseStates> extends EventEmitter {
  on(event: string, listener: ActorDespawnExportFunction<ResultType, StateType>): this,
  once(event: string, listener: ActorDespawnExportFunction<ResultType, StateType>): this,
}

export interface ActorSpawnEmitter<ResultType extends BaseResult, StateType extends BaseStates> extends EventEmitter {
  on(event: string, listener: ActorSpawnExportFunction<ResultType, StateType>): this,
  once(event: string, listener: ActorSpawnExportFunction<ResultType, StateType>): this,
}

export interface ParsingEmitter<ResultType extends BaseResult, StateType extends BaseStates> extends EventEmitter {
  on(event: 'channelOpened', listener: ChannelOpenedClosedFunction<ResultType, StateType>): this,
  once(event: 'channelOpened', listener: ChannelOpenedClosedFunction<ResultType, StateType>): this,
  on(event: 'channelClosed', listener: ChannelOpenedClosedFunction<ResultType, StateType>): this,
  once(event: 'channelClosed', listener: ChannelOpenedClosedFunction<ResultType, StateType>): this,
  on(event: 'nextChunk', listener: NextChunkFunction<ResultType, StateType>): this,
  once(event: 'nextChunk', listener: NextChunkFunction<ResultType, StateType>): this,
  on(event: 'nextFrame', listener: NextFrameFunction<ResultType, StateType>): this,
  once(event: 'nextFrame', listener: NextFrameFunction<ResultType, StateType>): this,
  on(event: 'finished', listener: NextFrameFunction<ResultType, StateType>): this,
  once(event: 'finished', listener: NextFrameFunction<ResultType, StateType>): this,
}

export interface EventEmittersObject<ResultType extends BaseResult, StateType extends BaseStates> {
  properties: PropertyExportEmitter<ResultType, StateType>,
  functionCall: FunctionCallEmitter<ResultType, StateType>,
  netDelta: NetDeltaExportEmitter<ResultType, StateType>,
  actorSpawn: ActorSpawnEmitter<ResultType, StateType>,
  actorDespawn: ActorDespawnEmitter<ResultType, StateType>,
  parsing: ParsingEmitter<ResultType, StateType>,
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
  (emitters: EventEmittersObject<ResultType, StateType>, globalData: GlobalData): void,
}

export interface CustomClass {
  serialize(reader: Replay, globalData: GlobalData, config?: unknown): void;
  resolve?(netGuidCache: NetGuidCache, globalData: GlobalData): void;
}

export interface CustomEnum {
  [number: number]: string,
}

export interface CustomClassMap {
  [name: string]: new () => CustomClass,
}

export interface CustomEnumMap {
  [name: string]: CustomEnum,
}

export interface ParseOptions {
  /** Decides which net field exports to parse */
  parseLevel?: number,
  /** Enables some additional features like debug files and loggin on console */
  debug?: boolean,
  /** A list of additional net field exports to parse  */
  customNetFieldExports?: NetFieldExportGroupConfig[],
  /** Decides if the default netFieldExports should be ignored or not */
  onlyUseCustomNetFieldExports?: boolean,
  /** A list that can be used to add or overwrite classes */
  customClasses?: CustomClassMap,
  /** A list that can be used to add or overwrite enums */
  customEnums?: CustomEnumMap,
  /** a function that sends event emitters and allows you to set custom export functions */
  setEvents?: SetEvents<BaseResult, BaseStates>,
  /** decides if parsing for most of the replay should be skipped and only parses the last minute  */
  useCheckpoints?: boolean,
  /** the minimum amount of seconds between the current time and the fast forward to target. if time is less fast forwarding will be skipped */
  fastForwardThreshold?: number,
  /** decides if event chunks are parsed */
  parseEvents?: boolean,
  /** decides if data chunks are parsed */
  parsePackets?: boolean,
  /** decides if a list of all chunks is exported */
  exportChunks?: boolean,
  /** if enabled every actor that is created will be in globalData.actorToPath even if its not parsed */
  enableActorToPath?: boolean,
}

export interface ParseStreamOptions extends ParseOptions {
  /** amount of chunks that can be downloadded at once */
  maxConcurrentDownloads?: number,
  /** amount of event chunks that can be downloadded at once */
  maxConcurrentEventDownloads?: number,
}

export interface ReplayParseFunction<T> {
  (replay: Replay): T,
}

export interface ReadObjectResult<U> {
  [key: string]: U,
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
  meta: Meta,
  logs?: Logs,
  /** contains information about the game acquired by event chunks */
  events?: Events,
  /** contains a list of all chunks in the replay */
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
  downloadTime: number,
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
