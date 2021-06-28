const onChannelOpened = (chIndex, actor, globalData) => {
  if (actor) {
    globalData.actorToChannel[actor.value] = chIndex;
    globalData.channelToActor[chIndex] = actor.value;
  }

  if (globalData.onChannelOpened) {
    globalData.onChannelOpened(chIndex, actor, globalData);
  }
}

module.exports = onChannelOpened;
