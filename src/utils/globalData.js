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
};

module.exports = globalData;
