const handleSoccerGame = ({ data, staticActorId, result, states, changedProperties }) => {
  if (!states.soccerGames[staticActorId]) {
    const newState = {
      scoreHistory: [],
    };

    states.soccerGames[staticActorId] = newState;
    result.mapData.soccerGames.push(newState);
  }

  const current = states.soccerGames[staticActorId];

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    current[key] = data[key];
  }

  if (data.Score_Team_A !== undefined || data.Score_Team_B !== undefined) {
    current.scoreHistory.push({
      Score_Team_A: current.Score_Team_A,
      Score_Team_B: current.Score_Team_B,
    })
  }
};

module.exports = handleSoccerGame;
