import { NetFieldExportGroupConfig } from '../../types/nfe';

const BroadcastRemoteClientInfo_MapMarker: NetFieldExportGroupConfig = {
  path: [
    "/Script/FortniteGame.FortBroadcastRemoteClientInfo:ClientRemotePlayerAddMapMarker",
    "/Script/FortniteGame.FortBroadcastRemoteClientInfo:ClientRemotePlayerRemoveMapMarker",
  ],
  customExportName: "mapMarker",
  parseLevel: 3,
  exports: {
    name: "markers",
    group: "gameData",
    type: "array",
  },
  states: {
    markers: "object",
  },
  properties: {
    PlayerID: {
      parseFunction: "readUInt32",
      parseType: "default",
    },
    BasePosition: {
      parseFunction: "readPackedVector100",
      parseType: "default",
    },
  },
};

export default BroadcastRemoteClientInfo_MapMarker;
