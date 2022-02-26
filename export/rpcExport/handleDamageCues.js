const handleDamageCues = ({ data, timeSeconds, states, actor }) => {
  const actorId = actor.actorNetGUID.value;

  const hitPlayer = states.pawns[data.HitActor];

  if (!hitPlayer) {
    return;
  }

  const hitPlayerState = states.players[hitPlayer.PlayerState];

  if (!hitPlayerState) {
    return;
  }

  states.pawns[actorId].damages.push({
    ...data,
    hitPlayerName: hitPlayerState.PlayerNamePrivate,
    timeSeconds,
    playerPos: states.pawns[actorId].ReplicatedMovement.location,
  });
}

module.exports = handleDamageCues;
