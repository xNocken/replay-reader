import { NetFieldExportGroupConfig } from '$types/lib';

const Vehicles: NetFieldExportGroupConfig = {
  path: [
    '/Valet/BasicCar',
    '/Valet/BasicTruck',
    '/Valet/BigRig/',
    '/Valet/SportsCar',
    '/Valet/TaxiCab',
    '/Game/Athena/DrivableVehicles',
    '/Nevada/Blueprints/Vehicle/Nevada_Vehicle_V2.Nevada_Vehicle_V2_C',
    '/Hoagie/HoagieVehicle.HoagieVehicle_C',
    '/Tank/Vehicle/Tank_Vehicle.Tank_Vehicle_C',
    '/ArmoredBattleBus/Vehicle/ArmoredBattleBus_Vehicle.ArmoredBattleBus_Vehicle_C',
    '/ResolveCannon/Environmental/MountedCannon/Vehicle/MountedCannon__v2.MountedCannon__v2_C',
  ],
  partialPath: true,
  customExportName: 'vehicle',
  exports: {
    name: 'vehicles',
    group: 'mapData',
    type: 'array',
  },
  states: {
    vehicles: 'object',
  },
  parseLevel: 2,
  properties: {
    Health: {
      parseFunction: 'readBit',
      parseType: 'default',
    },
    ReplicatedMovement: {
      type: 'FRepMovement',
      parseType: 'readClass',
    },
  },
};

export default Vehicles;
