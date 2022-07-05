const handlePlayerPawn = ({ actorId, data, states, changedProperties }) => {
  const { pawns, players } = states;
  const pawn = pawns[actorId];

  if (!pawn) {
    throw new Error('Pawn not found');
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    pawn[key] = data[key];
  }

  if (pawn.PlayerState && !pawn.resolvedPlayer) {
    const playerState = players[data.PlayerState];

    if (playerState) {
      playerState.PlayerPawn = pawn;

      pawn.resolvedPlayer = true;
    }
  }
};

module.exports = handlePlayerPawn;
