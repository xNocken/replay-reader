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

const handlePlayerPawn = ({ chIndex, data, globalData, states, changedProperties }) => {
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
        changedProperties,
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

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    playerState[key] = data[key];
  }
};

module.exports = handlePlayerPawn;
