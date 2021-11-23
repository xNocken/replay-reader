const handleSafezoneFastForwarding = ({ data, result, states, timeSeconds, setFastForward }) => {
  if (data.SafeZoneFinishShrinkTime && states.safeZones.SafeZoneFinishShrinkTime !== data.SafeZoneFinishShrinkTime) {
    result.gameData.safeZones.push(data);
    states.safeZones.SafeZoneFinishShrinkTime = data.SafeZoneFinishShrinkTime;

    const realTime = data.SafeZoneFinishShrinkTime - states.gameState.ingameToReplayTimeDiff;

    setFastForward(realTime);
  }
};

module.exports = handleSafezoneFastForwarding;
