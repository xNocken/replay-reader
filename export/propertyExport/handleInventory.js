const handleInventory = ({ chIndex, data, states }) => {
  if (!states.inventories[chIndex]) {
    states.inventories[chIndex] = {
      id: chIndex,
      replayPawn: data.ReplayPawn,
      items: [],
    };

    return;
  }

  if (data.ReplayPawn) {
    states.inventories[chIndex].replayPawn = data.ReplayPawn;
  }
};

module.exports = handleInventory;
