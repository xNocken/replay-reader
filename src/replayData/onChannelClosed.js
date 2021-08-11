const onChannelClosed = (chIndex, actor, globalData) => {
  delete globalData.channels[chIndex];

  if (actor) {
    delete globalData.actorToChannel[actor.value];
    delete globalData.channelToActor[chIndex];
  }

  if (globalData.onChannelClosed) {
    globalData.onChannelClosed(chIndex, actor, globalData);
  }
}

module.exports = onChannelClosed;
