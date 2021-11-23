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
    const channel = globalData.channels[bunch.chIndex];

    if (bunch.closeReason === 0) { // close reason 0 === destroyed
      let netFieldExportGroup;
      let staticActorId;

      if (channel.actor?.actorNetGUID.isDynamic()) {
        netFieldExportGroup = globalData.netGuidCache.GetNetFieldExportGroup(channel.actor.archetype.value, globalData);
      } else if (channel.actor) {
        const result = globalData.netGuidCache.getStaticActorExportGroup(channel.actor.actorNetGUID.value, globalData);

        netFieldExportGroup = result.group;
        staticActorId = result.staticActorId;
      }

      if (netFieldExportGroup) {
        try {
          globalData.actorDespawnEmitter.emit(
            pathhhh.basename(netFieldExportGroup.pathName),
            {
              openPacket: bunch.bOpen,
              chIndex: bunch.chIndex,
              timeSeconds: bunch.timeSeconds,
              netFieldExportGroup,
              staticActorId,
              globalData,
              result: globalData.result,
              states: globalData.states,
              setFastForward: globalData.setFastForward,
              stopParsing: globalData.stopParsingFunc,
            }
          );
        } catch (err) {
          console.error(`Error while exporting actorDespawn "${pathhhh.basename(netFieldExportGroup.pathName)}": ${err.stack}`);
        }
      }
    }

    onChannelClosed(bunch.chIndex, channel.actor, globalData);

    return true;
  }

  return false;
};

module.exports = receivedSequencedBunch;
