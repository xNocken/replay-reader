const handleGameState = (chIndex, gameState, timeseconds, mapObjectName, globalData) => {
  Object.entries(gameState).forEach(([key, value]) => {
    if (value !== null) {
      globalData.result.gameState[key] = value;
    }
  });
};

module.exports = handleGameState;
