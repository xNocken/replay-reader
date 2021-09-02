const handleInventory = ({ chIndex, data, states }) => {
  if (!states.inventories[chIndex]) {
    states.inventories[chIndex] = {
      id: chIndex,
      replayPawn: data.ReplayPawn,
      items: [],
    };
  }
};

module.exports = handleInventory;
