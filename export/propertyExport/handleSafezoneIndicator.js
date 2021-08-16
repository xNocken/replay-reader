const handleSafezone = ({ data, result }) => {
  if (data.SafeZoneStartShrinkTime && data.SafeZoneFinishShrinkTime) {
    result.gameData.safeZones.push(data);
  }
};

module.exports = handleSafezone;
