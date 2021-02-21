const { result } = require("../../utils/globalData");

const handleGameState = (chIndex, gameState) => {
  Object.entries(gameState).forEach(([key, value]) => {
    if (value !== null) {
      result.gameState[key] = value;
    }
  });
};

module.exports = handleGameState;
