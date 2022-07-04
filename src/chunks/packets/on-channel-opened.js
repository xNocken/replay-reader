const pathhhh = require('path');

const onChannelOpened = (channel, actor, bunch, globalData) => {
  const chIndex = channel.chIndex;

  try {
    globalData.parsingEmitter.emit('channelOpened', {
      chIndex,
      actor,
      globalData,
      result: globalData.result,
      states: globalData.states,
      setFastForward: globalData.setFastForward,
      stopParsing: globalData.stopParsingFunc,
    });
  } catch (err) {
    console.error(`Error while exporting "channelOpened": ${err.stack}`);
  }

  if (!actor) {
    return;
  }

  globalData.actorToChannel[actor.actorNetGUID.value] = chIndex;
  globalData.channelToActor[chIndex] = actor.actorNetGUID.value;

  let netFieldExportGroup;
  let staticActorId;

  if (globalData.dormantActors[actor.actorNetGUID.value]) {
    return;
  }

  if (actor?.actorNetGUID.isDynamic()) {
    netFieldExportGroup = globalData.netGuidCache.GetNetFieldExportGroup(actor.archetype.value, globalData);
  } else if (actor) {
    const result = globalData.netGuidCache.getStaticActorExportGroup(actor.actorNetGUID.value, globalData);

    netFieldExportGroup = result.group;
    staticActorId = result.staticActorId;
  }

  if (!netFieldExportGroup) {
    return;
  }

  try {
    globalData.actorSpawnEmitter.emit(
      netFieldExportGroup.customExportName || pathhhh.basename(netFieldExportGroup.pathName),
      {
        openPacket: bunch.bOpen,
        chIndex: bunch.chIndex,
        timeSeconds: bunch.timeSeconds,
        netFieldExportGroup,
        staticActorId,
        globalData,
        actor,
        result: globalData.result,
        states: globalData.states,
        setFastForward: globalData.setFastForward,
        stopParsing: globalData.stopParsingFunc,
        actorId: actor.actorNetGUID.value,
      },
    );
  } catch (err) {
    console.error(`Error while exporting actorSpawn "${pathhhh.basename(netFieldExportGroup.pathName)}": ${err.stack}`);
  }
};

module.exports = onChannelOpened;
