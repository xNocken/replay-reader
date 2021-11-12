const handleSafezoneFastForwarding = ({ data, result, states, timeSeconds, setFastForward }) => {
  if (data.SafeZoneStartShrinkTime && data.SafeZoneFinishShrinkTime) {
    result.gameData.safeZones.push(data);

    const realTime = data.SafeZoneFinishShrinkTime - (states.gameState.ReplicatedWorldTimeSeconds - timeSeconds)

    setFastForward(realTime);
  }
};

module.exports = handleSafezoneFastForwarding;
