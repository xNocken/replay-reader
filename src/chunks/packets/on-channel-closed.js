const pathhhh = require('path');

const onChannelClosed = (bunch, globalData) => {
  const channel = globalData.channels[bunch.chIndex];
  const actor = channel.actor;

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
          netFieldExportGroup.customExportName || pathhhh.basename(netFieldExportGroup.pathName),
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
            actor: channel.actor,
            actorId: bunch.actor.actorNetGUID.value,
          },
        );
      } catch (err) {
        console.error(`Error while exporting actorDespawn "${pathhhh.basename(netFieldExportGroup.pathName)}": ${err.stack}`);
      }
    }
  }

  try {
    globalData.parsingEmitter.emit('channelClosed', {
      chIndex: bunch.chIndex,
      actor,
      globalData,
      result: globalData.result,
      states: globalData.states,
      setFastForward: globalData.setFastForward,
      stopParsing: globalData.stopParsingFunc,
    });
  } catch (err) {
    console.error(`Error while exporting "channelClosed": ${err.stack}`);
  }

  delete globalData.ignoredChannels[bunch.chIndex];
  delete globalData.channels[bunch.chIndex];

  if (actor) {
    delete globalData.actorToChannel[actor.actorNetGUID.value];
    delete globalData.channelToActor[bunch.chIndex];
  }
};

module.exports = onChannelClosed;
