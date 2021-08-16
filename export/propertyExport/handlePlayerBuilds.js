const handlePlayerBuilds = ({ chIndex, data, globalData, states, result }) => {
  if (!globalData.result.mapData.playerBuilds[chIndex]) {
    states.playerBuilds[chIndex] = data;
    result.mapData.playerBuilds.push(data);
    return;
  }

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null) {
      result.mapData.playerBuilds[chIndex][key] = value;
    }
  });
}

module.exports = handlePlayerBuilds;
