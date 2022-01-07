const handleInventory = ({ actor, data, states }) => {
  const actorId = actor.actorNetGUID.value;

  if (!states.inventories[actorId]) {
    states.inventories[actorId] = {
      id: actorId,
      replayPawn: data.ReplayPawn,
      items: [],
    };

    return;
  }

  if (data.ReplayPawn) {
    states.inventories[actorId].replayPawn = data.ReplayPawn;
  }
};

module.exports = handleInventory;
