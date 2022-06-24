const handleSafezoneIndicator = ({ data, result, states }) => {
  if (
    data.SafeZoneFinishShrinkTime &&
    states.safeZones.SafeZoneFinishShrinkTime !== data.SafeZoneFinishShrinkTime
  ) {
    result.gameData.safeZones.push(data);
    states.safeZones.SafeZoneFinishShrinkTime = data.SafeZoneFinishShrinkTime;
  }
};

module.exports = handleSafezoneIndicator;
