const handleGameplayCues = ({ chIndex, data, timeseconds, result, states }) => {
  if (!result.gameData.gameplayCues[chIndex]) {
    result.gameData.gameplayCues[chIndex] = [];
    states.gameplayCues[chIndex] = result.gameData.gameplayCues[chIndex];
  }

  result.gameData.gameplayCues[chIndex].push({
    location: states.players[states.pawnChannelToStateChannel[chIndex]]?.ReplicatedMovement?.location || null,
    gameplayCueTag: data.GameplayCueTag,
    timeseconds,
  });
};

module.exports = handleGameplayCues;
