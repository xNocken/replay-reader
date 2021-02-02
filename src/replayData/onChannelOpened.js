const { actorToChannel, channelToActor } = require("../utils/globalData")

const onChannelOpened = (chIndex, actor) => {
  if (actor) {
    actorToChannel[actor.value] = chIndex;
    channelToActor[chIndex] = actor.value;
  }
}

module.exports = onChannelOpened;
