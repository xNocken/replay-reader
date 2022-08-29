import {
  Channel,
  Meta,
  Bunch,
  ParseStreamOptions,
  ParseOptions,
  NumberToNumber,
  SupportedEvents,
  NumberToBoolean,
  Header,
  GlobalDataEvents,
  OodleLib,
  EventEmittersObject,
  BaseResult,
  BaseStates,
} from '$types/lib';

import ffi from 'ffi-napi';
import EventEmitter from 'events';

import { NetFieldParser } from './NetFieldParser';
import { NetGuidCache } from './NetGuidCache';
import { setEvents } from '../../export/set-events';
import { getOozPath } from '../utils/get-ooz-path';
import { NetworkGUID } from '../../Classes/NetworkGUID';
import { ExternalDataMap, NetFieldExportGroup } from '$types/replay';
import { Logger } from './Logger';

class GlobalData<ResultType extends BaseResult> {
  channels: Channel[] = [];
  header?: Header;
  meta?: Meta;
  playerControllerGroups = [
    "BP_ReplayPC_Athena_C",
  ];
  partialBunch: Bunch = null;
  inReliable = 0;

  emitters: EventEmittersObject<ResultType, BaseStates> = {
    properties: new EventEmitter(),
    netDelta: new EventEmitter(),
    actorSpawn: new EventEmitter(),
    actorDespawn: new EventEmitter(),
    parsing: new EventEmitter(),
  };

  options: ParseStreamOptions<ResultType> = {
    parseLevel: 1,
    debug: false,
    onlyUseCustomNetFieldExports: false,
    setEvents: setEvents,
    useCheckpoints: false,
    fastForwardThreshold: 180,
    parseEvents: true,
    parsePackets: true,
    exportChunks: true,
    customClasses: {},
    customEnums: {},
  };

  result: ResultType = <ResultType>{};
  states: BaseStates = <BaseStates>{};

  actorToChannel: NumberToNumber = [];
  channelToActor: NumberToNumber = [];
  dormantActors: NumberToBoolean = [];

  eventData: GlobalDataEvents = {
    players: {},
    safeZones: [],
    chests: [],
  };
  supportedEvents: SupportedEvents[] = [
    'playerElim',
    'AthenaReplayBrowserEvents',
    'ZoneUpdate',
    'CharacterSample',
    'ActorsPosition',
    'AdditionGFPEventGroup',
  ];

  inPacketId = 0;
  lastFrameTime = 0;

  fastForwardTo = 0;
  fastForwardThreshold = 60;
  stopParsing = false;

  debugNetGuidToPathName: NetworkGUID[] = [];
  debugNotReadingGroups: Record<string, NetFieldExportGroup> = {};

  ignoredChannels: NumberToBoolean = {};

  externalData: ExternalDataMap = {};

  logger: Logger;
  netGuidCache = new NetGuidCache<ResultType>();
  netFieldParser: NetFieldParser<ResultType>;
  actorToPath: Record<number, string> = {};

  setFastForward = (time: number) => {
    this.fastForwardTo = time;
  };

  stopParsingFunc = () => {
    this.stopParsing = true;
  };

  oodleLib: OodleLib = <OodleLib><unknown>ffi.Library(getOozPath(), {
    OodleLZ_Decompress: ["size_t", ["uint8*", "size_t", "uint8*", "size_t", "int64", "int64", "int64", "int64", "int64", "int64", "int64", "int64", "int64", "int64"]],
  });

  constructor(overrideConfig: ParseOptions<ResultType> | ParseStreamOptions<ResultType>) {
    if (overrideConfig) {
      type OverrideConfigRecord = Record<keyof ParseStreamOptions<ResultType>, ParseStreamOptions<ResultType>[keyof ParseStreamOptions<ResultType>]>

      Object.entries(overrideConfig).forEach(([key, value]) => {
        (this.options as OverrideConfigRecord)[<keyof typeof overrideConfig>key] = value;
      });
    }

    this.netFieldParser = new NetFieldParser(this);
  }

  resetForCheckpoint() {
    this.channels = [];
    this.inPacketId = 0;
    this.actorToChannel = [];
    this.channelToActor = [];
    this.dormantActors = {};
    this.externalData = {};
    this.inReliable = 0;
    this.partialBunch = null;
    this.ignoredChannels = {};
    this.debugNetGuidToPathName = [];
    this.debugNotReadingGroups = {};
    this.netGuidCache = new NetGuidCache();
    this.netFieldParser.cleanForCheckpoint();
  }
}

export default GlobalData;
