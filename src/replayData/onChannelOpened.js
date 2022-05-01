const onChannelOpened = (chIndex, actor, globalData) => {
  if (actor) {
    globalData.actorToChannel[actor.actorNetGUID.value] = chIndex;
    globalData.channelToActor[chIndex] = actor.actorNetGUID.value;
  }

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
}
module.exports = onChannelOpened;
