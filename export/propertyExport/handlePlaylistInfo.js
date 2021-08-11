const handlePlaylistInfo = (chIndex, data, timeseconds, mapObjectName, globalData) => {
  globalData.result.gameData.playlistInfo = data.name;
}

module.exports = handlePlaylistInfo;
