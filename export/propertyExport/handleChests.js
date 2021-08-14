const handleChests = (chIndex, chest, timeseconds, staticActorId, globalData) => {
  if (!globalData.result.mapData.chests[staticActorId]) {
    chest.actor = globalData.netGuidCache.tryGetActorById(globalData.channelToActor[staticActorId]);
    globalData.result.mapData.chests[staticActorId] = {};
  }

  Object.entries(chest).forEach(([key, value]) => {
    if (value !== null) {
      globalData.result.mapData.chests[staticActorId][key] = value;
    }
  });
}

module.exports = handleChests;
