const handleGameState = ({ data, result, states }) => {
  if (!states.gameState.inited) {
    result.gameData.gameState = states.gameState;

    states.gameState.inited = true;
  }

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null) {
      result.gameData.gameState[key] = value;
    }
  });
};

module.exports = handleGameState;
