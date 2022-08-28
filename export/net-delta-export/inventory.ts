import { NetDeltaExportFunction } from '$types/lib';
import { DefaultResult, DefaultStates, InventoryDeltaExport } from '$types/result-data';

export const handleInventory: NetDeltaExportFunction<DefaultResult, DefaultStates, InventoryDeltaExport> = ({ states, data, actorId }) => {
  const inventory = states.inventories[actorId];

  if (!inventory) {
    return;
  }

  if (data.deleted) {
    delete inventory.items[data.elementIndex];

    return;
  }

  if (inventory.playerId !== inventory.ReplayPawn) {
    const playerChannel = states.pawnChannelToStateChannel[inventory.ReplayPawn];
    const player = states.players[playerChannel];

    if (player) {
      player.inventory = inventory;
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
