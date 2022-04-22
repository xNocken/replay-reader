const handleChest = ({ staticActorId, states, actorId, result }) => {
  if (!states.chests[actorId]) {
    states.chests[actorId] = {
      destroyed: true,
    };

    result.mapData.chests.push(states.chests[actorId]);

    return;
  }

  states.chests[actorId].destroyed = true;
};

module.exports = handleChest;
