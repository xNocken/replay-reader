import { NetFieldExportGroupConfig } from '../../types/nfe';

const Pickup: NetFieldExportGroupConfig = {
  path: "/Script/FortniteGame.FortPickupAthena",
  parseLevel: 3,
  customExportName: "pickup",
  exports: {
    name: "pickups",
    group: "mapData",
    type: "array",
  },
  states: {
    pickups: "object",
  },
  properties: {
    ReplicatedMovement: {
      type: "FRepMovement",
      parseType: "readClass",
    },
    Count: {
      parseFunction: "readInt32",
      parseType: "default",
    },
    ItemDefinition: {
      type: "ItemDefinition",
      parseType: "readClass",
    },
    Durability: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    Level: {
      parseFunction: "readInt32",
      parseType: "default",
    },
    LoadedAmmo: {
      parseFunction: "readInt32",
      parseType: "default",
    },
    PickupTarget: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
    ItemOwner: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
    LootInitialPosition: {
      parseFunction: "readPackedVector10",
      parseType: "default",
    },
    LootFinalPosition: {
      parseFunction: "readPackedVector10",
      parseType: "default",
    },
    FlyTime: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    StartDirection: {
      parseFunction: "readRotationShort",
      parseType: "default",
    },
    FinalTossRestLocation: {
      parseFunction: "readPackedVector10",
      parseType: "default",
    },
    TossState: {
      type: "EFortPickupTossState",
      parseType: "readEnum",
      bits: 2,
    },
    bPickedUp: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bTossedFromContainer: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bServerStoppedSimulation: {
      parseFunction: "readBit",
      parseType: "default",
    },
    PawnWhoDroppedPickup: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
  },
};

export default Pickup;