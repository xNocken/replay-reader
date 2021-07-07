const netGuidCache = require("../../utils/netGuidCache");

const handleChests = (chIndex, chest, timeSeconds, mapObjectName, globalData) => {
  if (!globalData.result.mapData.chests[mapObjectName]) {
    chest.actor = netGuidCache.tryGetActorById(globalData.channelToActor[mapObjectName]);
    globalData.result.mapData.chests[mapObjectName] = {};
  }

  Object.entries(chest).forEach(([key, value]) => {
    if (value !== null) {
      globalData.result.mapData.chests[mapObjectName][key] = value;
    }
  });
}

module.exports = handleChests;
