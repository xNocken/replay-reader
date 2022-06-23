const savePlayerData = (data, player) => {
  player.clientInfoId = data.PlayerClientInfo;
};

const handleFortBroadcastSpectatorInfo = ({ data, states }) => {
  data.PerPlayerInfo.forEach((playerData) => {
    const { PlayerState } = playerData;

    if (PlayerState && states.players) {
      const player = states.players[PlayerState];

      if (player) {
        savePlayerData(playerData, player);
      } else {
        states.queuedSpectatorInfo[PlayerState] = playerData;
      }
    }
  });
};

module.exports = handleFortBroadcastSpectatorInfo;
module.exports.savePlayerData = savePlayerData;
