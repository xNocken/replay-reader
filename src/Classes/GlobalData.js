const NetFieldParser = require('./NetFieldParser');
const NetGuidCache = require('./NetGuidCache');
const EventEmitter = require('events');
const setEvents = require('../../export/set-events');
const ffi = require('ffi-napi');
const getOozPath = require('../utils/get-ooz-path');

class GlobalData {
  constructor(overrideConfig = {}) {
    this.channels = [];
    this.info = null;
    this.playerControllerGroups = [
      "BP_ReplayPC_Athena_C",
    ];
    this.netFieldExports = {};
    this.partialBunch = null;
    this.parseLevel = 1;
    this.inReliable = 0;
    this.actorToChannel = [];
    this.channelToActor = [];
    this.dormantActors = {};
    this.result = {};
    this.states = {};
    this.setEvents = setEvents;
    this.customClasses = {};
    this.customEnums = {};
    this.customNetFieldExports = [];
    this.onlyUseCustomNetFieldExports = false;
    this.netGuidCache = new NetGuidCache();
    this.inPacketId = 0;
    this.lastFrameTime = 0;

    this.parseEvents = true;
    this.parsePackets = true;
    this.useCheckpoints = false;
    this.maxConcurrentDownloads = 3;
    this.maxConcurrentEventDownloads = 10;
    this.exportChunks = false;

    this.eventData = {
      players: {},
      safeZones: [],
      matchStats: {},
      chests: [],
    };
    this.supportedEvents = [
      'playerElim',
      'AthenaReplayBrowserEvents',
      'ZoneUpdate',
      'CharacterSample',
      'ActorsPosition',
      'AdditionGFPEventGroup',
    ];

    this.fastForwardTo = 0;
    this.fastForwardThreshold = 60;
    this.stopParsing = false;

    this.setFastForward = (time) => {
      this.fastForwardTo = time;
    };

    this.stopParsingFunc = () => {
      this.stopParsing = true;
    };

    this.externalData = {};
    this.additionalStates = [
      'actorToPath',
    ];

    this.emitters = {
      export: new EventEmitter(),
      netDelta: new EventEmitter(),
      actorSpawn: new EventEmitter(),
      actorDespawn: new EventEmitter(),
      parsing: new EventEmitter(),
    };

    this.debug = false;
    this.debugNetGuidToPathName = [];
    this.debugNotReadingGroups = {};
    this.ignoredChannels = {};

    Object.entries(overrideConfig).forEach(([key, value]) => {
      this[key] = value;
    });

    this.netFieldParser = new NetFieldParser(this);

    this.oodleLib = ffi.Library(getOozPath(), {
      OodleLZ_Decompress: ["size_t", ["uint8*", "size_t", "uint8*", "size_t", "int64", "int64", "int64", "int64", "int64", "int64", "int64", "int64", "int64", "int64"]],
    });
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

module.exports = GlobalData;
