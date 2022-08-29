import { NetFieldExportGroupConfig } from '$types/lib';

const Inventory: NetFieldExportGroupConfig = {
  path: "/Script/FortniteGame.FortInventory",
  parseLevel: 1,
  customExportName: "inventory",
  states: {
    inventories: "object",
  },
  properties: {
    Count: {
      parseFunction: "readInt32",
      parseType: "default",
    },
    ItemDefinition: {
      type: "ItemDefinition",
      parseType: "readClass",
    },
    LoadedAmmo: {
      parseFunction: "readInt32",
      parseType: "default",
    },
    ReplayPawn: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
  },
};

export default Inventory;