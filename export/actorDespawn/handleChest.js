const handleChest = ({ staticActorId, states, actor, result }) => {
  const actorId = actor.actorNetGUID.value;

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
