import { NetFieldExportGroupConfig } from '$types/lib';

const BroadcastRemoteClientInfo_ClientRemotePlayerHitMarkers: NetFieldExportGroupConfig = {
  path: "/Script/FortniteGame.FortBroadcastRemoteClientInfo:ClientRemotePlayerHitMarkers",
  parseLevel: 3,
  customExportName: "hitMarkers",
  properties: {
    ScreenSpaceHitLocations: {
      parseType: "readDynamicArray",
    },
    ScreenSpaceHitLocation: {
      type: "Vector2",
      parseType: "readClass",
    },
    bWasCriticalHit: {
      parseFunction: "readBit",
      parseType: "default",
    },
  },
};

export default BroadcastRemoteClientInfo_ClientRemotePlayerHitMarkers;
