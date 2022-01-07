const handleChests = ({ data, actor, staticActorId, result, states, changedProperties }) => {
  const actorId = actor.actorNetGUID.value;

  let chest = states.chests[actorId];

  if (!chest) {
    chest = {
      chestId: staticActorId,
    };

    states.chests[actorId] = chest;
    result.mapData.chests.push(chest)
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    states.chests[actorId][key] = data[key];
  }
}

module.exports = handleChests;
