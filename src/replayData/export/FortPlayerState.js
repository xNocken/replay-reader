const { players, channelToActor, queuedPlayerPawns } = require("../../utils/globalData");
const handlePlayerPawn = require("./PlayerPawn");

const onlySpectatingPlayers = [];

const handleQueuedPlayerPawns = (stateChIndex) => {
  const actorId = channelToActor[stateChIndex];

  if (!actorId) {
    return;
  }

  const playerPawns = queuedPlayerPawns[actorId];

  if (!playerPawns) {
    return;
  }

  playerPawns.forEach((playerPawn) => {
    handlePlayerPawn(playerPawn.chIndex, playerPawn.playerPawn)
  });
};

const handlePlayerState = (chIndex, state) => {
  if (state.bOnlySpectator == true) {
    onlySpectatingPlayers.push(chIndex);
    return;
  }

  if (onlySpectatingPlayers.includes(chIndex)) {
    return;
  }

  let playerData = players[chIndex];

  let newPlayer = false;

  if (!playerData) {
    playerData = state;
    players[chIndex] = playerData;
    newPlayer = true;
  }

  Object.entries(state).forEach(([key, value]) => {
    if (value !== null) {
      playerData[key] = value;
    }
  });

  if (newPlayer) {
    handleQueuedPlayerPawns(chIndex);
  }
};

module.exports = handlePlayerState;
