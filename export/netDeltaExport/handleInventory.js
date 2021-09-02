const handleInventory = ({ states, data, chIndex, globalData }) => {
  const inventory = states.inventories[chIndex];

  if (!inventory) {
    return;
  }

  if (data.deleted) {
    delete inventory.items[data.elementIndex];

    return;
  }

  if (data.export.ReplayPawn) {
    inventory.replayPawn = data.export.ReplayPawn;
  }

  if (!inventory.playerId) {
    const pawnChannel = globalData.actorToChannel[inventory.replayPawn];
    const playerChannel = states.pawnChannelToStateChannel[pawnChannel];
    const player = states.players[playerChannel];

    if (player) {
      player.inventory = inventory;
      inventory.playerId = player.PlayerId;
    }
  }

  if (!data.export.ItemDefinition) {
    return;
  }

  if (inventory.items[data.elementIndex]) {
    inventory.items[data.elementIndex].count = data.export.Count;
    inventory.items[data.elementIndex].ammo = data.export.LoadedAmmo;

    return;
  }

  inventory.items[data.elementIndex] = {
    count: data.export.Count,
    item: data.export.ItemDefinition,
    ammo: data.export.LoadedAmmo,
  };
};

module.exports = handleInventory;
