import { ActorSpawnExportFunction } from '../../types/lib';
import { DefaultResult, DefaultStates, PlayerPawn } from '../../types/result-data';

export const handlePlayerPawnSpawn: ActorSpawnExportFunction<DefaultResult, DefaultStates> = ({ states, actorId }) => {
  const pawn: PlayerPawn = {
    damages: [],
    gameplayCues: [],
  };

  states.pawns[actorId] = pawn;
  states.playerPawns[actorId] = pawn;
};
