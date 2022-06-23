const handleDamageCues = ({ data, timeSeconds, states, actorId }) => {
  const hitPlayer = states.pawns[data.HitActor];

  if (!hitPlayer) {
    return;
  }

  const hitPlayerState = states.players[hitPlayer.PlayerState];

  if (!hitPlayerState) {
    return;
  }

  const pawn = states.pawns[actorId];

  pawn.damages.push({
    ...data,
    hitPlayerName: hitPlayerState.PlayerNamePrivate,
    timeSeconds,
    playerPos: pawn.currentVehicle ? pawn.currentVehicle.ReplicatedMovement.location : pawn.ReplicatedMovement.location,
  });
};

module.exports = handleDamageCues;
