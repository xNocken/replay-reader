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

const handlePlayerPawn = ({ actor, data, states, changedProperties, timeSeconds }) => {
  const actorId = actor.actorNetGUID.value;
  const { pawnChannelToStateChannel, queuedPlayerPawns, players } = states;
  let playerState;

  if (data.PlayerState) {
    playerState = players[data.PlayerState];

    if (playerState) {
      pawnChannelToStateChannel[actorId] = data.PlayerState;
    } else {
      let playerPawns = queuedPlayerPawns[data.PlayerState];

      if (!playerPawns) {
        playerPawns = [];
        queuedPlayerPawns[data.PlayerState] = playerPawns;
      }

      playerPawns.push({
        playerPawn: data,
        changedProperties,
        actor,
      });

      return;
    }
  } else {
    playerState = tryGetPlayerDataFromPawn(actorId, states);

    if (!playerState) {
      return;
    }
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    playerState[key] = data[key];
  }

  if (data.Vehicle) {
    playerState.currentVehicle = states.vehicles[data.Vehicle];
  } else if (data.Vehicle === 0) {
    playerState.currentVehicle = null;
  }
};

module.exports = handlePlayerPawn;
