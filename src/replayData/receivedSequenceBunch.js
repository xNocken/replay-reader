const DataBunch = require('../Classes/DataBunch');
const onChannelClosed = require('./onChannelClosed');
const receivedActorBunch = require('./receivedActorBunch');
const pathhhh = require('path');

/**
 * @param {DataBunch} bunch
 */
const receivedSequencedBunch = (bunch, globalData) => {
  receivedActorBunch(bunch, bunch.archive, globalData);

  if (bunch.bClose) {
    const exportGroup = globalData.netGuidCache.GetNetFieldExportGroup(
      globalData.channels[bunch.chIndex].actor?.archetype?.value || globalData.channels[bunch.chIndex].actor?.actorNetGUID.value,
      globalData,
    );

    if (exportGroup && bunch.closeReason === 0) {
      globalData.actorDespawnEmitter.emit(
        pathhhh.basename(exportGroup.group.pathName),
        bunch.bOpen,
        bunch.chIndex,
        bunch.timeSeconds,
        exportGroup.group,
        exportGroup.mapObjectName,
        globalData,
      );
    }

    onChannelClosed(bunch.chIndex, globalData.channels[bunch.chIndex]?.actor?.actorNetGUID, globalData);

    return true;
  }

  return false;
};

module.exports = receivedSequencedBunch;
