import { PropertyExportFunction } from '$types/lib';
import { DefaultResult, DefaultStates, SupplyDropExport } from '$types/result-data';

type SupplyDropRecord = Record<keyof SupplyDropExport, SupplyDropExport[keyof SupplyDropExport]>;

export const handleSupplyDrop: PropertyExportFunction<DefaultResult, DefaultStates, SupplyDropExport> = ({ actorId, data, states, result, changedProperties }) => {
  let supplyDrop = states.supplyDrops[actorId];

  if (!supplyDrop) {
    supplyDrop = {};

    states.supplyDrops[actorId] = supplyDrop;
    result.mapData.supplyDrops.push(supplyDrop);

    return;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    (supplyDrop as SupplyDropRecord)[key] = data[key];
  }
};
