const netGuidCache = require("../../src/utils/netGuidCache");

const handleGameplayCues = (chIndex, value, timeseconds, globalData) => {
  const { channelToActor, result } = globalData;

  if (!result.gameData.gameplayCues[chIndex]) {
    result.gameData.gameplayCues[chIndex] = [];
  }

  result.gameData.gameplayCues[chIndex].push({
    location: netGuidCache.tryGetActorById(channelToActor[chIndex]).location,
    gameplayCueTag: value.GameplayCueTag,
    timeseconds,
  });
};

module.exports = handleGameplayCues;
