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

  if (!playerData.bIsABot && data.PlayerNamePrivate) {
    const name = data.PlayerNamePrivate;

    playerData.PlayerNamePrivate = name.split('').map((a, i) => String.fromCharCode(a.charCodeAt() + ((name.length % 4 * 3 % 8 + 1 + i) * 3 % 8))).join('')
  }

  if (newPlayer) {
    handleQueuedPlayerPawns(actorId, states);
  }
};

module.exports = handlePlayerState;
