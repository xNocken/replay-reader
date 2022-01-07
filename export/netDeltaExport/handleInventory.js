const handleInventory = ({ states, data, actor }) => {
  const actorId = actor.actorNetGUID.value;
  const inventory = states.inventories[actorId];

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
    const playerChannel = states.pawnChannelToStateChannel[inventory.replayPawn];
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
