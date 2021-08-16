const handleChests = ({ data, staticActorId, result, states }) => {
  if (!states.chests[staticActorId]) {
    states.chests[staticActorId] = data;
    result.mapData.chests.push(data)
    states.chests[staticActorId].chestId = staticActorId;

    return;
  }

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null) {
      states.chests[staticActorId][key] = value;
    }
  });
}

module.exports = handleChests;
