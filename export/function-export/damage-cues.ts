import { PropertyExportFunction } from '$types/lib';
import { DamageCueExport, DefaultResult, DefaultStates, PlayerPawn } from '$types/result-data';

export const handleDamageCues: PropertyExportFunction<DefaultResult, DefaultStates, DamageCueExport> = ({ data, timeSeconds, states, actorId }) => {
  const hitPlayer = <PlayerPawn>states.playerPawns[data.HitActor];

  if (!hitPlayer) {
    return;
  }

  const hitPlayerState = states.players[hitPlayer.PlayerState];

  if (!hitPlayerState) {
    return;
  }

  const pawn = states.playerPawns[actorId];

  pawn.damages.push({
    ...data,
    hitPlayerName: hitPlayerState.PlayerNamePrivate,
    timeSeconds,
    playerPos: pawn.currentVehicle ? pawn.currentVehicle.ReplicatedMovement.location : pawn.ReplicatedMovement.location,
  });
};
