const DataBunch = require('../Classes/DataBunch');
const onChannelClosed = require('./onChannelClosed');
const receivedActorBunch = require('./receivedActorBunch');

/**
 * @param {DataBunch} bunch
 */
const receivedSequencedBunch = (bunch, globalData) => {
  receivedActorBunch(bunch, bunch.archive, globalData);

  if (bunch.bClose) {
    delete globalData.channels[bunch.chIndex];

    onChannelClosed(bunch.ChIndex, globalData.channels[bunch.chIndex]?.actor.actorNetGUID, globalData);

    return true;
  }

  return false;
};

module.exports = receivedSequencedBunch;
