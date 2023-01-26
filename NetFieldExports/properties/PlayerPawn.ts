import { NetFieldExportGroupConfig } from '../../types/nfe';

const PlayerPawn: NetFieldExportGroupConfig = {
  path: "/Game/Athena/PlayerPawn_Athena.PlayerPawn_Athena_C",
  parseLevel: 1,
  customExportName: "playerPawn",
  states: {
    pawns: "object",
    playerPawns: "object",
    pawnChannelToStateChannel: "object",
    queuedPlayerPawns: "object",
  },
  properties: {
    bHidden: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bCanBeDamaged: {
      parseFunction: "readBit",
      parseType: "default",
    },
    ReplicatedMovement: {
      type: "FRepMovement",
      parseType: "readClass",
    },
    AttachSocket: {
      parseFunction: "readFName",
      parseType: "default",
    },
    ExitSocketIndex: {
      parseFunction: "readByte",
      parseType: "default",
    },
    AttachComponent: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
    PlayerState: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
    BoneName: {
      type: "FName",
      parseType: "readClass",
    },
    ReplayLastTransformUpdateTimeStamp: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    bIsCrouched: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bProxyIsJumpForceApplied: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsActive: {
      parseFunction: "readBit",
      parseType: "default",
    },
    CurrentMovementStyle: {
      type: "EFortMovementStyle",
      parseType: "readEnum",
      bits: 4,
    },
    PawnUniqueID: {
      parseFunction: "readInt32",
      parseType: "default",
    },
    bIsDying: {
      parseFunction: "readBit",
      parseType: "default",
    },
    CurrentWeapon: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
    bIsInvulnerable: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bMovingEmote: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bWeaponActivated: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsDBNO: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bWasDBNOOnDeath: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bWeaponHolstered: {
      parseFunction: "readBit",
      parseType: "default",
    },
    SpawnImmunityTime: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    LastReplicatedEmoteExecuted: {
      type: "ItemDefinition",
      parseType: "readClass",
    },
    GravityScale: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    WorldLookDir: {
      parseFunction: "readPackedVector1",
      parseType: "default",
    },
    bIsHonking: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsJumping: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsSprinting: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsWaterJump: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsWaterSprintBoost: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsWaterSprintBoostPending: {
      parseFunction: "readBit",
      parseType: "default",
    },
    BuildingState: {
      type: "EFortBuildingState",
      parseType: "readEnum",
      bits: 2,
    },
    bIsTargeting: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsPlayingEmote: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bStartedInteractSearch: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsWaitingForEmoteInteraction: {
      parseFunction: "readBit",
      parseType: "default",
    },
    GroupEmoteLookTarget: {
      type: "ItemDefinition",
      parseType: "readClass",
    },
    bIsSkydiving: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsParachuteOpen: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsParachuteForcedOpen: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsSkydivingFromBus: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bReplicatedIsInSlipperyMovement: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsInAnyStorm: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsSlopeSliding: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsProxySimulationTimedOut: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsInsideSafeZone: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsOutsideSafeZone: {
      parseFunction: "readBit",
      parseType: "default",
    },
    Zipline: {
      type: "ItemDefinition",
      parseType: "readClass",
    },
    PetState: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
    bIsZiplining: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bJumped: {
      parseFunction: "readBit",
      parseType: "default",
    },
    ParachuteAttachment: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
    EntryTime: {
      parseFunction: "readUInt32",
      parseType: "default",
    },
    CapsuleRadiusAthena: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    CapsuleHalfHeightAthena: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    WalkSpeed: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    RunSpeed: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    CrouchedSprintSpeed: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    WeaponActivated: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bIsInWaterVolume: {
      parseFunction: "readBit",
      parseType: "default",
    },
    BannerIconId: {
      parseFunction: "readString",
      parseType: "default",
    },
    BannerColorId: {
      parseFunction: "readString",
      parseType: "default",
    },
    ItemWraps: {
      type: "ItemDefinition",
      parseType: "readDynamicArray",
    },
    SkyDiveContrail: {
      type: "ItemDefinition",
      parseType: "readClass",
    },
    Glider: {
      type: "ItemDefinition",
      parseType: "readClass",
    },
    bIsDefaultCharacter: {
      parseFunction: "readBit",
      parseType: "default",
    },
    Pickaxe: {
      type: "ItemDefinition",
      parseType: "readClass",
    },
    Character: {
      type: "ItemDefinition",
      parseType: "readClass",
    },
    DBNOHoister: {
      type: "ActorGuid",
      parseType: "readClass",
    },
    Backpack: {
      type: "ItemDefinition",
      parseType: "readClass",
    },
    LoadingScreen: {
      type: "ItemDefinition",
      parseType: "readClass",
    },
    Dances: {
      type: "ItemDefinition",
      parseType: "readDynamicArray",
    },
    MusicPack: {
      type: "ItemDefinition",
      parseType: "readClass",
    },
    PetSkin: {
      type: "ItemDefinition",
      parseType: "readClass",
    },
    ReplicatedWaterBody: {
      parseFunction: "readIntPacked",
      parseType: "default",
    },
    DBNORevivalStacking: {
      parseFunction: "readByte",
      parseType: "default",
    },
    ServerWorldTimeRevivalTime: {
      parseFunction: "readUInt32",
      parseType: "default",
    },
    FlySpeed: {
      parseFunction: "readFloat32",
      parseType: "default",
    },
    bIsSkydivingFromLaunchPad: {
      parseFunction: "readBit",
      parseType: "default",
    },
    bInGliderRedeploy: {
      parseFunction: "readBit",
      parseType: "default",
    },
    EncryptedPawnReplayData: {
      parseType: 'readClass',
      type: 'FAthenaPawnReplayData',
    },
  },
};

export default PlayerPawn;
