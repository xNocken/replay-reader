const DataBunch = require('../Classes/DataBunch');
const NetFieldParser = require('../Classes/NetFieldExports/NetFieldParser');
const NetGuidCache = require('../Classes/NetGuidCache');
const UChannel = require('../Classes/UChannel');

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
    this.players = {};
    this.actorToChannel = [];
    this.channelToActor = [];
    this.pawnChannelToStateChannel = [];
    this.queuedPlayerPawns = [];
    this.pickups = {};
    this.result = {
      players: [],
      gameData: {
        safeZones: [],
        playlistInfo: null,
        activeGameplayModifiers: [],
        gameplayCues: {},
      },
      mapData: {
        pickups: [],
        playerBuilds: {},
        speedSigns: {},
        soccerGames: {},
        chests: {},
        vehicles: {
          valets: {},
        },
        markers: [],
        llamas: [],
        labradorLlamas: [],
        supplyDrops: [],
      },
      gameState: {},
    };
    this.onExportRead = null;
    this.onChannelOpened = null;
    this.onChannelClosed = null;
    this.netFieldExportPath = null;
    this.onlyUseCustomNetFieldExports = false;
    this.llamas = {};
    this.labradorLlamas = {};
    this.supplyDrops = {};
    this.netGuidCache = new NetGuidCache();
    this.inPacketId = 0;

    this.debug = false;
    this.debugNetGuidToPathName = [];

    Object.entries(overrideConfig).forEach(([key, value]) => {
      this[key] = value;
    });

    this.netFieldParser = new NetFieldParser(this);
  }
}

module.exports = GlobalData;
