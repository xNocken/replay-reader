const handlePlaylistInfo = (chIndex, data, timeseconds, staticActorId, globalData) => {
  globalData.result.gameData.playlistInfo = data.name;
}

module.exports = handlePlaylistInfo;
