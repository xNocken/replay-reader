const handleContainer = ({ data, actorId, staticActorId, result, states, changedProperties }) => {
  let container = states.containers[actorId];

  if (!container) {
    container = {
      pathName: staticActorId,
    };

    states.containers[actorId] = container;
    result.mapData.containers.push(container)
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    states.containers[actorId][key] = data[key];
  }
}

module.exports = handleContainer;
