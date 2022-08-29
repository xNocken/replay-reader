import { NetFieldExportGroupConfig } from '$types/lib';

const SoccerGame: NetFieldExportGroupConfig = {
  path: "/Game/Athena/Prototype/SoccerGame/Athena_SoccerGame.Athena_SoccerGame_C",
  parseLevel: 3,
  customExportName: "soccerGame",
  exports: {
    name: "soccerGames",
    group: "mapData",
    type: "array",
  },
  states: {
    soccerGames: "object",
  },
  staticActorIds: ["Athena_SoccerGame"],
  properties: {
    Score_Team_A: {
      parseFunction: "readInt32",
      parseType: "default",
    },
    Score_Team_B: {
      parseFunction: "readInt32",
      parseType: "default",
    },
    ScoreLocation: {
      parseFunction: "readVector",
      parseType: "default",
    },
    WinningTeam: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
    PlayerWhoScored: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
    bScoredWithToy: {
      parseFunction: "readBit",
      parseType: "default",
    },
  },
};

export default SoccerGame;