const handlePlayerBuilds = ({ actor, data, states, result, changedProperties }) => {
  const actorId = actor.actorNetGUID.value;

  if (!states.playerBuilds[actorId]) {
    states.playerBuilds[actorId] = data;
    result.mapData.playerBuilds.push(data);

    return;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    states.playerBuilds[actorId][key] = data[key];
  }
}

module.exports = handlePlayerBuilds;
