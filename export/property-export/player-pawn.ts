import { PropertyExportFunction } from '../../types/lib';
import { DefaultResult, DefaultStates, PlayerPawnExport } from '../../types/result-data';

type PlayerPawnRecord = Record<keyof PlayerPawnExport, PlayerPawnExport[keyof PlayerPawnExport]>;

export const handlePlayerPawn: PropertyExportFunction<DefaultResult, DefaultStates, PlayerPawnExport> = ({ actorId, data, states, changedProperties }) => {
  const { playerPawns, players } = states;
  const pawn = playerPawns[actorId];

  if (!pawn) {
    throw new Error('Pawn not found');
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    (pawn as PlayerPawnRecord)[key] = data[key];
  }

  if (pawn.PlayerState && !pawn.resolvedPlayer) {
    const playerState = players[data.PlayerState];

    if (playerState) {
      playerState.playerPawn = pawn;

      pawn.resolvedPlayer = true;
    }
  }
};
