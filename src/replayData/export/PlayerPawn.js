const {
  result,
  players,
  actorToChannel,
  pawnChannelToStateChannel,
  queuedPlayerPawns
} = require("../../utils/globalData");

const tryGetPlayerDataFromPawn = (pawn) => {
  const stateChannel = pawnChannelToStateChannel[pawn];

  if (stateChannel) {
    return players[stateChannel];
  }

  return null;
};

const handlePlayerPawn = (chIndex, pawn) => {
  if (pawn.PlayerState !== null) {
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
  } else {
    const playerState = tryGetPlayerDataFromPawn(chIndex);

    if (!playerState) {
      return;
    }
  }

  if (!result.players[chIndex]) {
    result.players[chIndex] = pawn;

    return;
  }

  Object.entries(pawn).forEach(([key, value]) => {
    if (value) {
      result.players[chIndex][key] = value;
    }
  });
};

module.exports = handlePlayerPawn;
