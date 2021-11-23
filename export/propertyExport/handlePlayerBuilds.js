const handlePlayerBuilds = ({ chIndex, data, globalData, states, result, changedProperties }) => {
  if (!states.playerBuilds[chIndex]) {
    states.playerBuilds[chIndex] = data;
    result.mapData.playerBuilds.push(data);
    return;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    states.playerBuilds[chIndex][key] = data[key];
  }
}

module.exports = handlePlayerBuilds;
