const handleGameplayCues = (chIndex, value, timeseconds, mapObjectName, globalData) => {
  const { channelToActor, result } = globalData;

  if (!result.gameData.gameplayCues[chIndex]) {
    result.gameData.gameplayCues[chIndex] = [];
  }

  result.gameData.gameplayCues[chIndex].push({
    location: globalData.netGuidCache.tryGetActorById(channelToActor[chIndex]).location,
    gameplayCueTag: value.GameplayCueTag,
    timeseconds,
  });
};

module.exports = handleGameplayCues;
