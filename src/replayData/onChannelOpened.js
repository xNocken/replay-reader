const onChannelOpened = (chIndex, actor, globalData) => {
  if (actor) {
    globalData.actorToChannel[actor.value] = chIndex;
    globalData.channelToActor[chIndex] = actor.value;
  }

  globalData.parsingEmitter.emit('channelOpened', {
    chIndex,
    actor,
    globalData,
    result: globalData.result,
    states: globalData.states,
    setFastForward: globalData.setFastForward,
    stopParsing: globalData.stopParsingFunc,
  });
}

module.exports = onChannelOpened;
