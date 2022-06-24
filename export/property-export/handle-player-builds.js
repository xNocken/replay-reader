const handlePlayerBuilds = ({ actorId, data, states, result, changedProperties }) => {
  let playerBuild = states.playerBuilds[actorId];

  if (!playerBuild) {
    playerBuild = {};

    states.playerBuilds[actorId] = playerBuild;
    result.mapData.playerBuilds.push(playerBuild);
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    playerBuild[key] = data[key];
  }
};

module.exports = handlePlayerBuilds;
