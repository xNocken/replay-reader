import { NetFieldExportGroupConfig } from '../../types/lib';

const BroadcastSpectatorInfo: NetFieldExportGroupConfig = {
  path: "/Script/FortniteGame.FortBroadcastSpectatorInfo",
  parseLevel: 3,
  customExportName: "broadcastSpectatorInfo",
  states: {
    broadcastSpectatorInfo: "object",
    queuedSpectatorInfo: "object",
  },
  properties: {
    PerPlayerInfo: {
      parseType: "readDynamicArray",
    },
    PlayerState: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
    PlayerInventory: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
    PlayerClientInfo: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
  },
};

export default BroadcastSpectatorInfo;
