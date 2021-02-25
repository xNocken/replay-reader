const handleSafezone = (chIndex, info, timeSeconds, globalData) => {
  if (info.SafeZoneStartShrinkTime && info.SafeZoneFinishShrinkTime) {
    globalData.result.gameData.safeZones.push(info)
  }
};

module.exports = handleSafezone;
