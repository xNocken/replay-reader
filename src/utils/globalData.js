const DataBunch = require('../Classes/DataBunch');
const NetFieldParser = require('../Classes/NetFieldExports/NetFieldParser');
const UChannel = require('../Classes/UChannel');

const globalData = {
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
  players: [],
  actorToChannel: [],
  channelToActor: [],
  pawnChannelToStateChannel: [],
  queuedPlayerPawns: [],
  result: {
    players: [],
    gameData: {
      safeZones: [],
    }
  }
};

module.exports = globalData;
