const handleGameState = ({ data, result, states, timeSeconds, changedProperties }) => {
  if (!states.gameState.inited) {
    result.gameData.gameState = states.gameState;

    states.gameState.inited = true;
    states.gameState.ingameToReplayTimeDiff = states.gameState.ReplicatedWorldTimeSeconds - timeSeconds;
  }

  if (data.ReplicatedWorldTimeSecondsDouble) {
    states.gameState.ReplicatedWorldTimeSeconds = data.ReplicatedWorldTimeSecondsDouble;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    states.gameState[key] = data[key];
  }
};

module.exports = handleGameState;
