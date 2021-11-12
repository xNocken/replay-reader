const DataBunch = require('../Classes/DataBunch');
const NetFieldParser = require('../Classes/NetFieldExports/NetFieldParser');
const NetGuidCache = require('../Classes/NetGuidCache');
const UChannel = require('../Classes/UChannel');
const EventEmitter = require('events');
const handleEventEmitter = require('../../export/handleEventEmitter');
const Info = require('../Classes/Info');

class GlobalData {
  constructor(overrideConfig = {}) {
    /**
     * @type {Array<UChannel>}
     */
    this.channels = [];
    /**
     * @type {Info}
     */
    this.info = null;
    this.playerControllerGroups = [
      "BP_ReplayPC_Athena_C"
    ];
    this.netFieldExports = {};
    /**
     * @type {DataBunch}
     */
    this.partialBunch = null;
    this.parseLevel = 1;
    this.inReliable = 0;
    this.actorToChannel = [];
    this.channelToActor = [];
    this.result = {};
    this.states = {};
    this.handleEventEmitter = handleEventEmitter;
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

    this.fastForwardTo = 0;
    this.fastForwardThreshold = 60;
    this.stopParsing = false;

    this.setFastForward = (time) => {
      this.fastForwardTo = time;
    }

    this.stopParsingFunc = () => {
      this.stopParsing = true;
    }

    this.externalData = {};
    this.additionalStates = [
      'pawnChannelToStateChannel',
      'queuedPlayerPawns',
    ];

    this.exportEmitter = new EventEmitter();
    this.netDeltaEmitter = new EventEmitter();
    this.actorDespawnEmitter = new EventEmitter();
    this.parsingEmitter = new EventEmitter();

    this.debug = false;
    this.debugNetGuidToPathName = [];
    this.debugNotReadingGroups = {};
    this.ignoredChannels = {};

    Object.entries(overrideConfig).forEach(([key, value]) => {
      this[key] = value;
    });

    this.netFieldParser = new NetFieldParser(this);
  }

  resetForCheckpoint() {
    this.channels = [];
    this.inPacketId = 0;
    this.actorToChannel = [];
    this.channelToActor = [];
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
