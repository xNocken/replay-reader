import { NetFieldExportGroupConfig } from '$types/lib';

const VehicleSeat: NetFieldExportGroupConfig = {
  path: "/Script/FortniteGame.FortVehicleSeatComponent",
  parseLevel: 2,
  customExportName: "vehicleSeatComponent",
  redirects: ["VehicleSeatComponent"],
  properties: {
    PlayerSlots: {
      parseType: "readDynamicArray",
    },
    Player: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
    PlayerEntryTime: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    WeaponComponent: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
    SeatIndex: {
      parseFunction: "readInt32",
      parseType: "default",
    },
  },
};

export default VehicleSeat;
