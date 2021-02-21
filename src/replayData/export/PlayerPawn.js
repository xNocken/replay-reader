const {
  players,
  actorToChannel,
  pawnChannelToStateChannel,
  queuedPlayerPawns,
  channelToActor,
} = require("../../utils/globalData");
const netGuidCache = require("../../utils/netGuidCache");

const tryGetPlayerDataFromPawn = (pawn) => {
  const stateChannel = pawnChannelToStateChannel[pawn];

  if (stateChannel) {
    return players[stateChannel];
  }

  return null;
};

const handlePlayerPawn = (chIndex, pawn) => {
  let playerState;

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

    playerState = players[stateChannelIndex];

  } else {
    playerState = tryGetPlayerDataFromPawn(chIndex);

    if (!playerState) {
      return;
    }
  }

  playerState.actor = netGuidCache.tryGetActorById(channelToActor[chIndex]);
  Object.entries(pawn).forEach(([key, value]) => {
    if (value !== null) {
      playerState[key] = value;
    }
  });
};

module.exports = handlePlayerPawn;
