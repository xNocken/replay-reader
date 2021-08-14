const handleSafezone = (chIndex, info, timeseconds, staticActorId, globalData) => {
  if (info.SafeZoneStartShrinkTime && info.SafeZoneFinishShrinkTime) {
    globalData.result.gameData.safeZones.push(info);
  }
};

module.exports = handleSafezone;
