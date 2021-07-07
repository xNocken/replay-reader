const handlePlaylistInfo = (chIndex, data, timeSeconds, globalData) => {
  globalData.result.gameData.playlistInfo = data.name;
}

module.exports = handlePlaylistInfo;
