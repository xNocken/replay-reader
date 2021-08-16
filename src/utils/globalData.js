const DataBunch = require('../Classes/DataBunch');
const NetFieldParser = require('../Classes/NetFieldExports/NetFieldParser');
const NetGuidCache = require('../Classes/NetGuidCache');
const UChannel = require('../Classes/UChannel');
const EventEmitter = require('events');
const handleEventEmitter = require('../../export/handleEventEmitter');

class GlobalData {
  constructor(overrideConfig = {}) {
    /**
     * @type {Array<UChannel>}
     */
    this.channels = [];
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
    this.onChannelOpened = null;
    this.onChannelClosed = null;
    this.netFieldExportPath = null;
    this.onlyUseCustomNetFieldExports = false;
    this.netGuidCache = new NetGuidCache();
    this.inPacketId = 0;

    this.externalData = {};
    this.additionalStates = [
      'pawnChannelToStateChannel',
      'queuedPlayerPawns',
    ];

    this.exportEmitter = new EventEmitter();
    this.netDeltaEmitter = new EventEmitter();
    this.actorDespawnEmitter = new EventEmitter();

    this.debug = false;
    this.debugNetGuidToPathName = [];

    Object.entries(overrideConfig).forEach(([key, value]) => {
      this[key] = value;
    });

    this.netFieldParser = new NetFieldParser(this);
  }
}

module.exports = GlobalData;
