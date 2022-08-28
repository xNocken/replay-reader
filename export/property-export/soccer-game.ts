import { PropertyExportFunction } from '$types/lib';
import { DefaultResult, DefaultStates, SoccerGameExport } from '$types/result-data';

type SoccerGameRecord = Record<keyof SoccerGameExport, SoccerGameExport[keyof SoccerGameExport]>;

export const handleSoccerGame: PropertyExportFunction<DefaultResult, DefaultStates, SoccerGameExport> = ({ actorId, result, states, data, changedProperties }) => {
  let soccerGame = states.soccerGames[actorId];

  if (!soccerGame) {
    soccerGame = {
      scoreHistory: [],
    };

    states.soccerGames[actorId] = soccerGame;
    result.mapData.soccerGames.push(soccerGame);
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    (soccerGame as SoccerGameRecord)[key] = data[key];
  }

  if (data.Score_Team_A !== undefined || data.Score_Team_B !== undefined) {
    soccerGame.scoreHistory.push({
      Score_Team_A: soccerGame.Score_Team_A,
      Score_Team_B: soccerGame.Score_Team_B,
    });
  }
};
