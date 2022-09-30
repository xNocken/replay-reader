import { NetFieldExportGroupConfig } from '../../types/nfe';

const PlayerBuilds: NetFieldExportGroupConfig = {
  path: "/Game/Building/ActorBlueprints/Player/",
  customExportName: "playerBuild",
  parseLevel: 4,
  partialPath: true,
  exports: {
    name: "playerBuilds",
    group: "mapData",
    type: "array",
  },
  states: {
    playerBuilds: "object",
  },
  properties: {
    bDestroyed: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bPlayerPlaced: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bCollisionBlockedByPawns: {
      parseFunction: "readBit",
      parseType: "default",
    },
    TeamIndex: {
      parseFunction: "readByte",
      parseType: "default",
    },
    Health: {
      parseFunction: "readInt16",
      parseType: "default",
    },
    EditingPlayer: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
  },
};

export default PlayerBuilds;
