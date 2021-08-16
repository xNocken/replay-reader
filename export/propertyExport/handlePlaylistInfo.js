const handlePlaylistInfo = ({ data, result }) => {
  result.gameData.playlistInfo = data.name;
}

module.exports = handlePlaylistInfo;
