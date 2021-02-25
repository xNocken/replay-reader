const DataBunch = require('../Classes/DataBunch');
const recievedActorBunch = require('./recievedActorBunch');

/**
 * @param {DataBunch} bunch
 */
const recievedSequencedBunch = (bunch, globalData) => {
  recievedActorBunch(bunch, globalData);

  if (bunch.bClose) {
    delete globalData.channels[bunch.chIndex];

    // onChannelClosed(bunch.ChIndex, channels[bunch.chIndex]?.actor?.actorNetGUID); // TODO

    return true;
  }

  return false;
};

module.exports = recievedSequencedBunch;
