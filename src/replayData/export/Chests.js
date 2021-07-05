const netGuidCache = require("../../utils/netGuidCache");

const handleChests = (chIndex, chest, timeSeconds, globalData) => {
  if (!globalData.result.mapData.chests[chIndex]) {
    chest.actor = netGuidCache.tryGetActorById(globalData.channelToActor[chIndex]);
    globalData.result.mapData.chests[chIndex] = chest;
    return;
  }

  Object.entries(chest).forEach(([key, value]) => {
    if (value !== null) {
      globalData.result.mapData.chests[chIndex][key] = value;
    }
  });
}

module.exports = handleChests;
