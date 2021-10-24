const onChannelClosed = (chIndex, actor, globalData) => {
  globalData.parsingEmitter.emit('channelClosed', {
    chIndex,
    actor,
    globalData,
    result: globalData.result,
    states: globalData.states,
    setFastForward: globalData.setFastForward,
  });

  delete globalData.ignoredChannels[chIndex];
  delete globalData.channels[chIndex];

  if (actor) {
    delete globalData.actorToChannel[actor.actorNetGUID.value];
    delete globalData.channelToActor[chIndex];
  }
}

module.exports = onChannelClosed;
