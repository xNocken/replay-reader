const savePlayerData = (data, player) => {
  player.clientInfoId = data.PlayerClientInfo;
};

const handleBroadcastSpectatorInfo = ({ data, states }) => {
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

module.exports = handleBroadcastSpectatorInfo;
module.exports.savePlayerData = savePlayerData;
