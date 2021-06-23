const onChannelOpened = (chIndex, actor, globalData) => {
  if (actor) {
    globalData.actorToChannel[actor.value] = chIndex;
    globalData.channelToActor[chIndex] = actor.value;
  }
}

module.exports = onChannelOpened;
