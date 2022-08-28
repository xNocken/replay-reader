import { PropertyExportFunction } from "$types/lib";
import { DefaultResult, DefaultStates, GameStateExport } from "$types/result-data";

type GameStateRecord = Record<keyof GameStateExport, GameStateExport[keyof GameStateExport]>;

export const handleGameState: PropertyExportFunction<DefaultResult, DefaultStates, GameStateExport> = ({ data, result, states, timeSeconds, changedProperties }) => {
  if (!states.gameState.inited) {
    result.gameData.gameState = states.gameState;

    states.gameState.inited = true;
    states.gameState.ingameToReplayTimeDiff = data.ReplicatedWorldTimeSeconds - timeSeconds;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];
    const val = data[key];

    (states.gameState as GameStateRecord)[key] = val;
  }
};
