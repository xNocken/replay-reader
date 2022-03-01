const { savePlayerData } = require("./handleFortBroadcastSpectatorInfo");
const handlePlayerPawn = require("./handlePlayerPawn");

const onlySpectatingPlayers = [];

const handleQueuedPlayerPawns = (actorId, states) => {
  const playerPawns = states.queuedPlayerPawns[actorId];

  if (!playerPawns) {
    return;
  }

  playerPawns.forEach((playerPawn) => {
    handlePlayerPawn({
      actor: playerPawn.actor,
      data: playerPawn.playerPawn,
      changedProperties: playerPawn.changedProperties,
      states,
    })
  });
};

const handleQueuedSpectatorInfo = (actorId, states, player) => {
  const spectatorInfo = states.queuedSpectatorInfo[actorId];

  if (!spectatorInfo) {
    return;
  }

  savePlayerData(spectatorInfo, player);
};

const handlePlayerState = ({ actor, data, states, result, changedProperties }) => {
  const actorId = actor.actorNetGUID.value;

  if (data.bOnlySpectator == true) {
    onlySpectatingPlayers.push(actorId);

    return;
  }

  if (onlySpectatingPlayers.includes(actorId)) {
    return;
  }

  let playerData = states.players[actorId];

  let newPlayer = false;

  if (!playerData) {
    playerData = {
      ...data,
      actorId,
    };

    states.players[actorId] = playerData;
    result.gameData.players.push(playerData);
    newPlayer = true;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    playerData[key] = data[key];
  }

  if (playerData.PlayerNamePrivate_encrypted && data.PlayerNamePrivate) {
    const name = data.PlayerNamePrivate;

    playerData.PlayerNamePrivate = name.split('').map((a, i) => String.fromCharCode(a.charCodeAt() + ((name.length % 4 * 3 % 8 + 1 + i) * 3 % 8))).join('')
  }

  if (newPlayer) {
    handleQueuedPlayerPawns(actorId, states);
    handleQueuedSpectatorInfo(actorId, states, playerData);
  }

  if (playerData.clientInfoId && !playerData.clientPlayerData) {
    const clientPlayerData = states.remoteClientInfo[playerData.clientInfoId];

    if (clientPlayerData) {
      playerData.clientPlayerData = clientPlayerData;
    }
  }
};

module.exports = handlePlayerState;
