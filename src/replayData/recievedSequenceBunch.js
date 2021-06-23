const DataBunch = require('../Classes/DataBunch');
const onChannelClosed = require('./onChannelClosed');
const recievedActorBunch = require('./recievedActorBunch');

/**
 * @param {DataBunch} bunch
 */
const recievedSequencedBunch = (bunch, globalData) => {
  recievedActorBunch(bunch, bunch.archive, globalData);

  if (bunch.bClose) {
    delete globalData.channels[bunch.chIndex];

    onChannelClosed(bunch.ChIndex, globalData.channels[bunch.chIndex]?.actor.actorNetGUID, globalData);

    return true;
  }

  return false;
};

module.exports = recievedSequencedBunch;
