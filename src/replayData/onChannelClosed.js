const onChannelClosed = (chIndex, actor, globalData) => {
  if (actor) {
    delete globalData.actorToChannel[actor.value];
    delete globalData.channelToActor[chIndex];
  }
}

module.exports = onChannelClosed;
