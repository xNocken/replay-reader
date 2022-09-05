import { NetFieldExportGroupConfig } from '../../types/lib';

const BroadcastRemoteClientInfo: NetFieldExportGroupConfig = {
  path: "/Script/FortniteGame.FortBroadcastRemoteClientInfo",
  customExportName: "broadcastRemoteClientInfo",
  parseLevel: 3,
  states: {
    remoteClientInfo: "object",
  },
  properties: {
    RemoteEventScore: {
      parseFunction: "readInt32",
      parseType: "default",
    },
  },
};

export default BroadcastRemoteClientInfo;
