const { result } = require("../../utils/globalData")

const handlePlaylistInfo = (chIndex, data) => {
  result.gameData.playlistInfo = data.name;
}

module.exports = handlePlaylistInfo;
