const tryGetPlayerDataFromPawn = (pawn, globalData) => {
  const {
    players,
    pawnChannelToStateChannel,
  } = globalData;
  const stateChannel = pawnChannelToStateChannel[pawn];

  if (stateChannel) {
    return players[stateChannel];
  }

  return null;
};

const handlePlayerPawn = (chIndex, pawn, timeseconds, mapObjectName, globalData) => {
  const {
    players,
    actorToChannel,
    pawnChannelToStateChannel,
    queuedPlayerPawns,
    channelToActor,
  } = globalData;
  let playerState;

  if (pawn.PlayerState) {
    const actorId = pawn.PlayerState;

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
        playerPawn: pawn,
      });

      return;
    }

    playerState = players[stateChannelIndex];

  } else {
    playerState = tryGetPlayerDataFromPawn(chIndex, globalData);

    if (!playerState) {
      return;
    }
  }

  playerState.actor = globalData.netGuidCache.tryGetActorById(channelToActor[chIndex]);
  Object.entries(pawn).forEach(([key, value]) => {
    if (value !== null) {
      playerState[key] = value;
    }
  });
};

module.exports = handlePlayerPawn;
