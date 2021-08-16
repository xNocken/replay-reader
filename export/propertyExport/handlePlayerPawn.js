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

const handlePlayerPawn = ({ chIndex, data, globalData, states }) => {
  const { actorToChannel } = globalData;
  const { pawnChannelToStateChannel, queuedPlayerPawns, players } = states;
  let playerState;

  if (data.PlayerState) {
    const actorId = data.PlayerState;

    let stateChannelIndex = actorToChannel[actorId];

    if (stateChannelIndex !== undefined) {
      pawnChannelToStateChannel[chIndex] = stateChannelIndex;
    } else {
      let playerPawns = queuedPlayerPawns[actorId];

      if (!playerPawns) {
        playerPawns = [];
        queuedPlayerPawns[actorId] = playerPawns;
      }

      playerPawns.push({
        chIndex,
        playerPawn: data,
      });

      return;
    }

    playerState = players[stateChannelIndex];

  } else {
    playerState = tryGetPlayerDataFromPawn(chIndex, states);

    if (!playerState) {
      return;
    }
  }

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null) {
      playerState[key] = value;
    }
  });
};

module.exports = handlePlayerPawn;
