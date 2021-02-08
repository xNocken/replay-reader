const DataBunch = require('../Classes/DataBunch');
const NetFieldParser = require('../Classes/NetFieldExports/NetFieldParser');
const UChannel = require('../Classes/UChannel');

// TODO: make this better

const globalDataDefault = () => ({
  /**
   * @type {Array<UChannel>}
   */
  channels: [],
  playerControllerGroups: {},
  netFieldParser: new NetFieldParser(),
  netFieldExports: {},
  /**
   * @type {DataBunch}
   */
  partialBunch: null,
  parseLevel: 1, // TODO: make config
  inReliable: 0,
  players: {},
  actorToChannel: [],
  channelToActor: [],
  pawnChannelToStateChannel: [],
  queuedPlayerPawns: [],
  pickups: {},
  result: {
    players: [],
    gameData: {
      safeZones: [],
      playlistInfo: null,
    },
    mapData: {
      pickups: [],
    },
    gameState: {},
  },
});

let globalData = globalDataDefault();

module.exports = globalData;
