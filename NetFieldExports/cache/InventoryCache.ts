import { NetFieldExportGroupConfig } from '../../types/nfe';

const InventoryCache: NetFieldExportGroupConfig = {
  type: "classNetCache",
  path: "FortInventory_ClassNetCache",
  properties: {
    Inventory: {
      parseType: "netDeltaSerialize",
      type: "inventory",
      enablePropertyChecksum: true,
    },
  },
};

export default InventoryCache;
