const handlePlayerBuilds = (chIndex, value, globalData) => {
  if (!globalData.result.mapData.playerBuilds[chIndex]) {
    globalData.result.mapData.playerBuilds[chIndex] = value;
    return;
  }

  Object.entries(value).forEach(([key, value]) => {
    if (value !== null) {
      globalData.result.mapData.playerBuilds[chIndex][key] = value;
    }
  });
}

module.exports = handlePlayerBuilds;
