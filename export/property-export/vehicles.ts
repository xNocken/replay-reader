import { PropertyExportFunction } from '$types/lib';
import { DefaultResult, DefaultStates, VehicleExport } from '$types/result-data';

type VehicleRecord = Record<keyof VehicleExport, VehicleExport[keyof VehicleExport]>;

export const handleVehicles: PropertyExportFunction<DefaultResult, DefaultStates, VehicleExport> = ({ actorId, data, states, result, changedProperties }) => {
  let vehicle = states.vehicles[actorId];

  if (!vehicle) {
    vehicle = {
      type: data.pathName,
      seats: [],
    };

    states.vehicles[actorId] = vehicle;
    result.mapData.vehicles.push(vehicle);
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    (vehicle as VehicleRecord)[key] = data[key];
  }
};
