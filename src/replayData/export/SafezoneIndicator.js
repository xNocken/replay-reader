const { result } = require("../../utils/globalData");

const handleSafezone = (chIndex, info) => {
  if (info.SafeZoneStartShrinkTime && info.SafeZoneFinishShrinkTime) {
    result.gameData.safeZones.push(info)
  }
};

module.exports = handleSafezone;
