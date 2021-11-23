const handleChests = ({ data, staticActorId, result, states, changedProperties }) => {
  if (!states.chests[staticActorId]) {
    states.chests[staticActorId] = data;
    result.mapData.chests.push(data)
    states.chests[staticActorId].chestId = staticActorId;

    return;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    states.chests[staticActorId][key] = data[key];
  }
}

module.exports = handleChests;
