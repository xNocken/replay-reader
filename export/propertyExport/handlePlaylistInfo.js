const handlePlaylistInfo = (data, globalData) => {
  globalData.result.gameData.playlistInfo = data.name;
}

module.exports = handlePlaylistInfo;
