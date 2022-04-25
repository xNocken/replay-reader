const tryGetPlayerDataFromPawn = (pawn, states) => {
  const {
    players,
    pawnChannelToStateChannel,
  } = states;
  const stateChannel = pawnChannelToStateChannel[pawn];

  if (stateChannel) {
    return players[stateChannel];
  }

  return null;
};

const handlePlayerPawn = ({ actorId, data, states, changedProperties }) => {
  const { pawns, players } = states;
  let pawn = pawns[actorId];

  if (!pawn) {
    pawn = {
      damages: [],
    };

    pawns[actorId] = pawn;
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
