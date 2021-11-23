const handleGameState = ({ data, result, states, timeSeconds }) => {
  if (!states.gameState.inited) {
    result.gameData.gameState = states.gameState;

    states.gameState.inited = true;
    states.gameState.ingameToReplayTimeDiff = states.gameState.ReplicatedWorldTimeSeconds - timeSeconds;
  }

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null) {
      result.gameData.gameState[key] = value;
    }
  });
};

module.exports = handleGameState;
