import { FunctionCallFunction } from '../../types/lib';
import { DamageCueExport, DefaultResult, DefaultStates, PlayerPawn } from '../../types/result-data';

export const handleDamageCues: FunctionCallFunction<DefaultResult, DefaultStates, DamageCueExport> = ({ data, timeSeconds, states, actorId, logger }) => {
  const hitPlayer = <PlayerPawn>states.playerPawns[data.HitActor];

  if (!hitPlayer) {
    return;
  }

  const hitPlayerState = states.players[hitPlayer.PlayerState];

  if (!hitPlayerState) {
    return;
  }

  const pawn = states.playerPawns[actorId];

  if (!pawn) {
    logger.warn('Received damage cue for not tracked pawn');

    return;
  }

  const playerState = states.players[pawn.PlayerState];

  if (!playerState) {
    logger.warn('Received damage cue for not tracked player state');

    return;
  }

  playerState.damageDealt += data.Magnitude;

  pawn.damages.push({
    ...data,
    hitPlayerName: hitPlayerState.PlayerNamePrivate,
    timeSeconds,
    playerPos: pawn.currentVehicle ? pawn.currentVehicle.ReplicatedMovement?.location : pawn.ReplicatedMovement?.location,
  });
};
