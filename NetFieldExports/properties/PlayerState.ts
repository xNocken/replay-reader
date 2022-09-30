import { NetFieldExportGroupConfig } from '../../types/nfe';

const PlayerState: NetFieldExportGroupConfig = {
  path: "/Script/FortniteGame.FortPlayerStateAthena",
  customExportName: "playerState",
  parseLevel: 1,
  exports: {
    name: "players",
    group: "gameData",
    type: "array",
  },
  states: {
    players: "object",
  },
  properties: {
    TeamIndex: {
      parseType: 'default',
      parseFunction: 'readByte',
      versionOverrides: [{
        versions: {
          engineNetworkVersion: 9,
          method: 'smallerThan',
        },
        settings: {
          parseFunction: 'readBitsToUnsignedInt',
          args: [7],
        },
      }]
    },
    PlayerID: {
      parseFunction: "readUInt32",
      parseType: "default",
    },
    UniqueId: {
      parseFunction: "readNetId",
      parseType: "default",
    },
    BotUniqueId: {
      parseFunction: "readNetId",
      parseType: "default",
    },
    PlayerNamePrivate: {
      parseFunction: "readString",
      parseType: "default",
    },
    bOnlySpectator: {
      parseFunction: "readBit",
      parseType: "default",
    },
    DeathCause: {
      type: "EDeathCause",
      parseType: "readEnum",
      bits: 6,
    },
    bIsDisconnected: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsABot: {
      parseFunction: "readBit",
      parseType: "default",
    },
    DeathTags: {
      type: "FGameplayTagContainer",
      parseType: "readClass",
    },
    VictimTags: {
      type: "FGameplayTagContainer",
      parseType: "readClass",
    },
    FinisherOrDownerTags: {
      type: "FGameplayTagContainer",
      parseType: "readClass",
    },
    KillScore: {
      parseFunction: "readInt32",
      parseType: "default",
    },
  },
};

export default PlayerState;
