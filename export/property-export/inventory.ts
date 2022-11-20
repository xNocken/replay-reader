import { PropertyExportFunction } from '../../types/lib';
import { DefaultResult, DefaultStates, InventoryExport } from '../../types/result-data';

export const handleInventoryProperty: PropertyExportFunction<DefaultResult, DefaultStates, InventoryExport> = ({ actorId, data, states }) => {
  if (!states.inventories[actorId]) {
    states.inventories[actorId] = {
      id: actorId,
      ReplayPawn: data.ReplayPawn,
      items: [],
    };

    return;
  }

  if (data.ReplayPawn) {
    states.inventories[actorId].ReplayPawn = data.ReplayPawn;
  }
};
