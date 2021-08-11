const handlePlayerPawn = require("./handlePlayerPawn");

const onlySpectatingPlayers = [];

const handleQueuedPlayerPawns = (stateChIndex, globalData) => {
  const {  channelToActor, queuedPlayerPawns } = globalData;
  const actorId = channelToActor[stateChIndex];

  if (!actorId) {
    return;
  }

  const playerPawns = queuedPlayerPawns[actorId];

  if (!playerPawns) {
    return;
  }

  playerPawns.forEach((playerPawn) => {
    handlePlayerPawn(playerPawn.chIndex, playerPawn.playerPawn, 0, '', globalData)
  });
};

const handlePlayerState = (chIndex, state, timeseconds, mapObjectName, globalData) => {
  const { players } = globalData;
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

  if (!playerData.bIsABot && state.PlayerNamePrivate) {
    const name = state.PlayerNamePrivate;

    playerData.PlayerNamePrivate = name.split('').map((a, i) => String.fromCharCode(a.charCodeAt() + ((name.length % 4 * 3 % 8 + 1 + i) * 3 % 8))).join('')
  }

  if (newPlayer) {
    handleQueuedPlayerPawns(chIndex, globalData);
  }
};

module.exports = handlePlayerState;
