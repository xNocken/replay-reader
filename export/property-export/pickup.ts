import { PropertyExportFunction } from '$types/lib';
import { DefaultResult, DefaultStates, PickupExport } from '$types/result-data';

type PickupRecord = Record<keyof PickupExport, PickupExport[keyof PickupExport]>;

export const handlePickup: PropertyExportFunction<DefaultResult, DefaultStates, PickupExport> = ({ actorId, data, result, states, changedProperties }) => {
  let pickup = states.pickups[actorId];

  if (!pickup) {
    pickup = {};

    states.pickups[actorId] = pickup;
    result.mapData.pickups.push(pickup);
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    (pickup as PickupRecord)[key] = data[key];
  }
};
