import { NetFieldExportGroupConfig } from '$types/lib';

const InventoryCache: NetFieldExportGroupConfig = {
  path: "FortInventory_ClassNetCache",
  type: "ClassNetCache",
  parseLevel: 1,
  properties: {
    Inventory: {
      type: "inventory",
      parseType: "netDeltaSerialize",
      enablePropertyChecksum: true,
    },
  },
};

export default InventoryCache;
