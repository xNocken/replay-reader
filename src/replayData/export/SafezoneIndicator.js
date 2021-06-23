const handleSafezone = (chIndex, info, timeSeconds, globalData) => {
  if (info.SafeZoneStartShrinkTime && info.SafeZoneFinishShrinkTime) {
    const zones = globalData.result.gameData.safeZones;

    zones[zones.length] = info;
  }
};

module.exports = handleSafezone;
