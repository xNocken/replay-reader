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
  inReliable: 0,
};

module.exports = globalData;
