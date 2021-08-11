const handleFortPickup = (chIndex, data, timeseconds, mapObjectName, globalData) => {
  const { pickups, channelToActor } = globalData;
  if (!pickups[chIndex]) {
    pickups[chIndex] = data;
    return;
  }

  pickups[chIndex].actor = globalData.netGuidCache.tryGetActorById(channelToActor[chIndex]);

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null) {
      pickups[chIndex][key] = value;
    }
  });
};

module.exports = handleFortPickup;
