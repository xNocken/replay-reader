import { NetFieldExportGroupConfig } from '$types/lib';

const GameState: NetFieldExportGroupConfig = {
  path: "/Game/Athena/Athena_GameState.Athena_GameState_C",
  parseLevel: 1,
  customExportName: "gameState",
  exports: {
    name: "gameState",
    group: "gameData",
    type: "object",
  },
  states: {
    gameState: "object",
  },
  properties: {
    GoldenPoiLocationTags: {
      type: "FGameplayTagContainer",
      parseType: "readClass",
    },
    DefaultBattleBus: {
      type: "ItemDefinition",
      parseType: "readClass",
    },
    ReplicatedWorldTimeSeconds: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    MatchState: {
      type: "FName",
      parseType: "readClass",
    },
    GameplayState: {
      type: "EFortGameplayState",
      parseType: "readEnum",
      bits: 3,
    },
    GameSessionId: {
      parseFunction: "readString",
      parseType: "default",
    },
    TotalPlayerStructures: {
      parseFunction: "readInt32",
      parseType: "default",
    },
    ServerGameplayTagIndexHash: {
      parseFunction: "readUInt32",
      parseType: "default",
    },
    GameDifficulty: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    ServerStability: {
      type: "EServerStability",
      parseType: "readEnum",
      bits: 3,
    },
    ServerChangelistNumber: {
      parseFunction: "readInt32",
      parseType: "default",
    },
    WarmupCountdownStartTime: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    WarmupCountdownEndTime: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    bSafeZonePaused: {
      parseFunction: "readBit",
      parseType: "default",
    },
    AircraftStartTime: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    bSkyTubesShuttingDown: {
      parseFunction: "readBit",
      parseType: "default",
    },
    SafeZonesStartTime: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    bSkyTubesDisabled: {
      parseFunction: "readBit",
      parseType: "default",
    },
    PlayersLeft: {
      parseFunction: "readInt32",
      parseType: "default",
    },
    EndGameStartTime: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    TeamsLeft: {
      parseFunction: "readInt32",
      parseType: "default",
    },
    EndGameKickPlayerTime: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    StormCapState: {
      type: "EAthenaStormCapState",
      parseType: "readEnum",
      bits: 3,
    },
    FlightStartLocation: {
      parseFunction: "readPackedVector100",
      parseType: "default",
    },
    FlightStartRotation: {
      parseFunction: "readRotationShort",
      parseType: "default",
    },
    FlightSpeed: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    TimeTillFlightEnd: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    TimeTillDropStart: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    TimeTillDropEnd: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    UtcTimeStartedMatch: {
      type: "FDateTime",
      parseType: "readClass",
    },
    SafeZonePhase: {
      parseFunction: "readByte",
      parseType: "default",
    },
    GamePhase: {
      type: "EAthenaGamePhase",
      parseType: "readEnum",
      bits: 3,
    },
    Aircrafts: {
      parseFunction: "readIntPacked",
      parseType: "readDynamicArray",
    },
    bAircraftIsLocked: {
      parseFunction: "readBit",
      parseType: "default",
    },
    WinningPlayerState: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
    WinningPlayerList: {
      parseFunction: "readUInt32",
      parseType: "readDynamicArray",
    },
    WinningTeam: {
      parseFunction: "readUInt32",
      parseType: "default",
    },
    WinningScore: {
      parseFunction: "readUInt32",
      parseType: "default",
    },
    CurrentHighScore: {
      parseFunction: "readUInt32",
      parseType: "default",
    },
    CurrentHighScoreTeam: {
      parseFunction: "readUInt32",
      parseType: "default",
    },
    bStormReachedFinalPosition: {
      parseFunction: "readBit",
      parseType: "default",
    },
    SpectateAPartyMemberAvailable: {
      parseFunction: "readBit",
      parseType: "default",
    },
    HopRockDuration: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    bIsLargeTeamGame: {
      parseFunction: "readBit",
      parseType: "default",
    },
    DefaultGliderRedeployCanRedeploy: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    DefaultRedeployGliderLateralVelocityMult: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    DefaultRedeployGliderHeightLimit: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    EventTournamentRound: {
      type: "EEventTournamentRound",
      parseType: "readEnum",
      bits: 3,
    },
    EventId: {
      parseFunction: "readInt32",
      parseType: "default",
    },
    PlayerBotsLeft: {
      parseFunction: "readInt32",
      parseType: "default",
    },
    TrackedCosmetics: {
      type: "ItemDefinition",
      parseType: "readDynamicArray",
    },
    PlayerID: {
      parseFunction: "readInt32",
      parseType: "default",
    },
    PlayerId: {
      parseFunction: "readInt32",
      parseType: "default",
    },
  },
};

export default GameState;
