const handleChest = ({ staticActorId, states }) => {
  if (!states.chests[staticActorId]) {
    states.chests[staticActorId] = {
      destroyed: true,
    };

    return;
  }

  states.chests[staticActorId].destroyed = true;
};

module.exports = handleChest;
