import { NetFieldExportGroupConfig } from '../../types/lib';

const BroadcastRemoteClientInfo: NetFieldExportGroupConfig = {
  path: "FortBroadcastRemoteClientInfo_ClassNetCache",
  parseLevel: 3,
  type: "classNetCache",
  properties: {
    ClientRemotePlayerAddMapMarker: {
      type: "/Script/FortniteGame.FortBroadcastRemoteClientInfo:ClientRemotePlayerAddMapMarker",
      parseType: "function",
    },
    ClientRemotePlayerRemoveMapMarker: {
      type: "/Script/FortniteGame.FortBroadcastRemoteClientInfo:ClientRemotePlayerRemoveMapMarker",
      parseType: "function",
    },
    ClientRemotePlayerHitMarkers: {
      type: "/Script/FortniteGame.FortBroadcastRemoteClientInfo:ClientRemotePlayerHitMarkers",
      parseType: "function",
    },
  },
};

export default BroadcastRemoteClientInfo;
