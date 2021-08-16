const handleSoccerGame = ({ data, staticActorId, result, states }) => {
  if (!states.soccerGames[staticActorId]) {
    const newState = {
      scoreHistory: [],
    };

    states.soccerGames[staticActorId] = newState;
    result.mapData.soccerGames.push(newState);
  }

  const current = states.soccerGames[staticActorId];

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null) {
      current[key] = value;
    }
  });

  if (data.Score_Team_A !== undefined || data.Score_Team_B !== undefined) {
    current.scoreHistory.push({
      Score_Team_A: current.Score_Team_A,
      Score_Team_B: current.Score_Team_B,
    })
  }
};

module.exports = handleSoccerGame;
