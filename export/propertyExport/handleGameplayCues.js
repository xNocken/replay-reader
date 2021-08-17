const handleGameplayCues = ({ chIndex, data, timeSeconds, result, states }) => {
  if (!result.gameData.gameplayCues[chIndex]) {
    result.gameData.gameplayCues[chIndex] = [];
    states.gameplayCues[chIndex] = result.gameData.gameplayCues[chIndex];
  }

  result.gameData.gameplayCues[chIndex].push({
    location: states.players[states.pawnChannelToStateChannel[chIndex]]?.ReplicatedMovement?.location || null,
    gameplayCueTag: data.GameplayCueTag,
    timeSeconds,
  });
};

module.exports = handleGameplayCues;
