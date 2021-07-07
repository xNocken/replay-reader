const handleSoccerGame = (mapObjectName, value, globalData) => {
  if (!globalData.result.mapData.soccerGames[mapObjectName]) {
    globalData.result.mapData.soccerGames[mapObjectName] = {};
  }

  const current = globalData.result.mapData.soccerGames[mapObjectName];

  Object.entries(value).forEach(([key, value]) => {
    if (value !== null) {
      current[key] = value;
    }
  });

  if (value.Score_Team_A !== undefined || value.Score_Team_B !== undefined) {
    if (!current.scoreHistory) {
      current.scoreHistory = [];
    }

    current.scoreHistory.push({
      Score_Team_A: current.Score_Team_A,
      Score_Team_B: current.Score_Team_B,
    })
  }
};

module.exports = handleSoccerGame;
