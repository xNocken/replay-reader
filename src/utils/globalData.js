const DataBunch = require('../Classes/DataBunch');
const NetFieldParser = require('../Classes/NetFieldExports/NetFieldParser');
const UChannel = require('../Classes/UChannel');

class GlobalData {
  constructor(overrideConfig = {}) {
    /**
     * @type {Array<UChannel>}
     */
    this.channels = [];
    this.playerControllerGroups = {};
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
      },
      mapData: {
        pickups: [],
        playerBuilds: [],
        speedSigns: [],
        chests: [],
        vehicles: {
          valets: [],
        }
      },
      gameState: {},
    };
    this.onExportRead = null;
    this.netFieldExportPath = null;
    this.onlyUseCustomNetFieldExports = false;

    this.debug = false;

    Object.entries(overrideConfig).forEach(([key, value]) => {
      this[key] = value;
    });

    this.netFieldParser = new NetFieldParser(this);
  }
}

module.exports = GlobalData;
