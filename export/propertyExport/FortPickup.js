const netGuidCache = require("../..//src/utils/netGuidCache");

const handleFortPickup = (chIndex, data, timesecodns, globalData) => {
  const { pickups, channelToActor } = globalData;
  if (!pickups[chIndex]) {
    pickups[chIndex] = data;
    return;
  }

  pickups[chIndex].actor = netGuidCache.tryGetActorById(channelToActor[chIndex]);

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null) {
      pickups[chIndex][key] = value;
    }
  });
};

module.exports = handleFortPickup;
