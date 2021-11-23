const onChannelClosed = (chIndex, actor, globalData) => {
  try {
    globalData.parsingEmitter.emit('channelClosed', {
      chIndex,
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

  delete globalData.ignoredChannels[chIndex];
  delete globalData.channels[chIndex];

  if (actor) {
    delete globalData.actorToChannel[actor.actorNetGUID.value];
    delete globalData.channelToActor[chIndex];
  }
}

module.exports = onChannelClosed;
