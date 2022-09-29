import { BaseResult, BaseStates, Data, FortSet, FRotator, FVector, RemoveIndex } from "./lib";
import { FGameplayTagContainer } from "../Classes/FGameplayTagContainer";
import { ItemDefinition } from "../Classes/ItemDefinition";
import { FName } from "../Classes/FName";
import { EAthenaStormCapState } from '../Enums/EAthenaStormCapState';
import { EFortGameplayState } from '../Enums/EFortGameplayState';
import { EServerStability } from '../Enums/EServerStability';
import { EAthenaGamePhase } from '../Enums/EAthenaGamePhase';
import { EEventTournamentRound } from '../Enums/EEventTournamentRound';
import { EDeathCause } from '../Enums/EDeathCause';
import { FRepMovement } from '../Classes/FRepMovement';
import { EFortMovementStyle } from '../Enums/EFortMovementStyle';
import { EFortBuildingState } from '../Enums/EFortBuildingState';
import { ActorGuid } from '../Classes/ActorGuid';
import { EFortPickupTossState } from '../Enums/EFortPickupTossState';
import { EAlertLevel } from '../Enums/EAlertLevel';
import { FGameplayTag } from '../Classes/FGameplayTag';
import { Vector2 } from '../Classes/Vector2';

interface CustomMap<T> {
  [key: number]: T,
}

export interface SafeZone extends RemoveIndex<Data> {
  PreviousRadius?: number,
  LastRadius?: number,
  NextRadius?: number,
  PreviousCenter?: FVector,
  LastCenter?: FVector,
  NextCenter?: FVector,
  NextNextCenter?: FVector,
  SafeZoneStartShrinkTime?: number,
  SafeZoneFinishShrinkTime?: number,
  Radius?: number,
}

export interface GameStateExport extends RemoveIndex<Data> {
  GoldenPoiLocationTags?: FGameplayTagContainer,
  DefaultBattleBus?: ItemDefinition,
  ReplicatedWorldTimeSeconds?: number,
  MatchState?: FName,
  GameplayState?: EFortGameplayState,
  GameSessionId?: string,
  TotalPlayerStructures?: number,
  ServerGameplayTagIndexHash?: number,
  GameDifficulty?: number,
  ServerStability?: EServerStability,
  ServerChangelistNumber?: number,
  WarmupCountdownStartTime?: number,
  WarmupCountdownEndTime?: number,
  bSafeZonePaused?: boolean,
  AircraftStartTime?: number,
  bSkyTubesShuttingDown?: boolean,
  SafeZonesStartTime?: number,
  bSkyTubesDisabled?: boolean,
  PlayersLeft?: number,
  EndGameStartTime?: number,
  TeamsLeft?: number,
  EndGameKickPlayerTime?: number,
  StormCapState?: EAthenaStormCapState,
  FlightStartLocation?: FVector,
  FlightStartRotation?: FRotator,
  FlightSpeed?: number,
  TimeTillFlightEnd?: number,
  TimeTillDropStart?: number,
  TimeTillDropEnd?: number,
  UtcTimeStartedMatch?: Date,
  SafeZonePhase?: number,
  GamePhase?: EAthenaGamePhase,
  bAircraftIsLocked?: boolean,
  WinningPlayerState?: number,
  WinningPlayerList?: number[],
  WinningTeam?: number,
  WinningScore?: number,
  CurrentHighScore?: number,
  CurrentHighScoreTeam?: number,
  bStormReachedFinalPosition?: boolean,
  SpectateAPartyMemberAvailable?: boolean,
  HopRockDuration?: number,
  bIsLargeTeamGame?: boolean,
  DefaultGliderRedeployCanRedeploy?: boolean,
  DefaultRedeployGliderLateralVelocityMult?: number,
  DefaultRedeployGliderHeightLimit?: number,
  EventTournamentRound?: EEventTournamentRound,
  EventId?: number,
  PlayerBotsLeft?: number,
  TrackedCosmetics?: ItemDefinition[],
  PlayerID?: number,
  PlayerId?: number,
}

export interface ContainerExport extends RemoveIndex<Data> {
  bHidden?: boolean,
  bAlreadySearched?: boolean,
  ReplicatedLootTier?: number,
  SearchingPawn?: number,
}

export interface Container extends ContainerExport {
  pathName?: string,
  destroyed?: boolean,
  despawned?: boolean,
}

export interface PlayerStateExport extends RemoveIndex<Data> {
  PlayerID?: number,
  UniqueId?: string,
  BotUniqueId?: string,
  PlayerNamePrivate?: string,
  bOnlySpectator?: boolean,
  DeathCause?: EDeathCause,
  bIsDisconnected?: boolean,
  bIsABot?: boolean,
  DeathTags?: FGameplayTagContainer,
  VictimTags?: FGameplayTagContainer,
  FinisherOrDownerTags?: FGameplayTagContainer,
  KillScore?: number,
  PlayerNamePrivate_encrypted?: boolean,
}

export interface PlayerState extends PlayerStateExport {
  actorId?: number,
  clientInfoId?: number,
  remoteClientInfo?: RemoteClientInfo,
  health?: FortSet,
  shield?: FortSet,
  overShield?: FortSet,
  inventory?: Inventory,
  playerPawn?: PlayerPawn,
}

export interface PlayerPawnExport extends RemoveIndex<Data> {
  bHidden?: boolean,
  bCanBeDamaged?: boolean,
  ReplicatedMovement?: FRepMovement,
  AttachSocket?: string,
  ExitSocketIndex?: number,
  AttachComponent?: number,
  PlayerState?: number,
  BoneName?: string,
  ReplayLastTransformUpdateTimeStamp?: number,
  bIsCrouched?: boolean,
  bProxyIsJumpForceApplied?: boolean,
  bIsActive?: boolean,
  CurrentMovementStyle?: EFortMovementStyle,
  PawnUniqueID?: number,
  bIsDying?: boolean,
  CurrentWeapon?: number,
  bIsInvulnerable?: boolean,
  bMovingEmote?: boolean,
  bWeaponActivated?: boolean,
  bIsDBNO?: boolean,
  bWasDBNOOnDeath?: boolean,
  bWeaponHolstered?: boolean,
  SpawnImmunityTime?: number,
  LastReplicatedEmoteExecuted?: number,
  GravityScale?: number,
  WorldLookDir?: FVector,
  bIsHonking?: boolean,
  bIsJumping?: boolean,
  bIsSprinting?: boolean,
  bIsWaterJump?: boolean,
  bIsWaterSprintBoost?: boolean,
  bIsWaterSprintBoostPending?: boolean,
  BuildingState?: EFortBuildingState,
  bIsTargeting?: boolean,
  bIsPlayingEmote?: boolean,
  bStartedInteractSearch?: boolean,
  bIsWaitingForEmoteInteraction?: boolean,
  GroupEmoteLookTarget?: ItemDefinition,
  bIsSkydiving?: boolean,
  bIsParachuteOpen?: boolean,
  bIsParachuteForcedOpen?: boolean,
  bIsSkydivingFromBus?: boolean,
  bReplicatedIsInSlipperyMovement?: boolean,
  bIsInAnyStorm?: boolean,
  bIsSlopeSliding?: boolean,
  bIsProxySimulationTimedOut?: boolean,
  bIsInsideSafeZone?: boolean,
  bIsOutsideSafeZone?: boolean,
  Zipline?: ItemDefinition,
  PetState?: number,
  bIsZiplining?: boolean,
  bJumped?: boolean,
  ParachuteAttachment?: number,
  EntryTime?: number,
  CapsuleRadiusAthena?: number,
  CapsuleHalfHeightAthena?: number,
  WalkSpeed?: number,
  RunSpeed?: number,
  CrouchedSprintSpeed?: number,
  WeaponActivated?: boolean,
  bIsInWaterVolume?: boolean,
  BannerIconId?: string,
  BannerColorId?: string,
  ItemWraps?: ItemDefinition[],
  SkyDiveContrail?: ItemDefinition,
  Glider?: ItemDefinition,
  bIsDefaultCharacter?: boolean,
  Pickaxe?: ItemDefinition,
  Character?: ItemDefinition
  DBNOHoister?: ActorGuid,
  Backpack?: ItemDefinition
  LoadingScreen?: ItemDefinition
  Dances?: ItemDefinition
  MusicPack?: ItemDefinition
  PetSkin?: ItemDefinition
  ReplicatedWaterBody?: boolean,
  DBNORevivalStacking?: number,
  ServerWorldTimeRevivalTime?: number,
  FlySpeed?: number,
  bIsSkydivingFromLaunchPad?: boolean,
  bInGliderRedeploy?: boolean,
}

export interface PlayerPawn extends PlayerPawnExport {
  damages: DamageCue[],
  gameplayCues: GameplayCue[],
  resolvedPlayer?: boolean,
  currentVehicle?: Vehicle,
}

export interface DamageCueExport extends RemoveIndex<Data> {
  Location?: FVector,
  Normal?: FVector,
  Magnitude?: number,
  bWeaponActivate?: boolean,
  bIsFatal?: boolean,
  bIsCritical?: boolean,
  bIsShield?: boolean,
  bIsShieldDestroyed?: boolean,
  bIsShieldApplied?: boolean,
  bIsBallistic?: boolean,
  bIsBeam?: boolean,
  NonPlayerbIsFatal?: boolean,
  NonPlayerbIsCritical?: boolean,
  HitActor?: number,
  NonPlayerHitActor?: number,
}

export interface DamageCue extends DamageCueExport {
  hitPlayerName: string,
  timeSeconds: number,
  playerPos: FVector,
}

export interface PlaylistInfoExport extends RemoveIndex<Data> {
  name?: string,
}

export interface GameState extends GameStateExport {
  inited?: boolean,
  ingameToReplayTimeDiff?: number,
}

export interface PlayerBuildExport extends RemoveIndex<Data> {
  bDestroyed?: boolean,
  bPlayerPlaced?: boolean,
  bCollisionBlockedByPawns?: boolean,
  TeamIndex?: number,
  Health?: number,
  EditingPlayer?: number,
}

export interface PickupExport extends RemoveIndex<Data> {
  ReplicatedMovement?: FRepMovement,
  Count?: number,
  ItemDefinition?: ItemDefinition,
  Durability?: number,
  Level?: number,
  LoadedAmmo?: number,
  PickupTarget?: number,
  ItemOwner?: number,
  LootInitialPosition?: FVector,
  LootFinalPosition?: FVector,
  FlyTime?: number,
  StartDirection?: FRotator,
  FinalTossRestLocation?: FVector,
  TossState?: EFortPickupTossState,
  bPickedUp?: boolean,
  bTossedFromContainer?: boolean,
  bServerStoppedSimulation?: boolean,
  PawnWhoDroppedPickup?: number,
}

export interface LlamaExport extends RemoveIndex<Data> {
  Looted?: boolean,
  ReplicatedMovement?: FRepMovement,
}

export interface LabradorExport extends RemoveIndex<Data> {
  ReplicatedMovement?: FRepMovement,
  bIsHiddenForDeath?: boolean,
  PawnUniqueID?: number,
  NPC_AlertLevel?: EAlertLevel,
}

export interface Labrador extends LabradorExport {
  bIsDisappeared?: boolean,
  bIsRunning?: boolean,
  bIsDisappearing?: boolean,
  gameplayCues: GameplayCue[],
  currentVehicle?: Vehicle,
}

export interface GameplayCueExport extends RemoveIndex<Data> {
  GameplayCueTag?: FGameplayTag,
}

export interface GameplayCue {
  location?: FVector,
  gameplayCueTag: FGameplayTag,
  timeSeconds: number,
}

export interface InventoryExport extends RemoveIndex<Data> {
  ReplayPawn?: number,
}

export interface Inventory extends InventoryExport {
  id?: number,
  items?: InventoryItem[],
  playerId?: number,
}

export interface InventoryDeltaExport extends RemoveIndex<Data> {
  Count?: number,
  ItemDefinition?: ItemDefinition,
  LoadedAmmo?: number,
}

export interface InventoryItem {
  count?: number,
  item?: ItemDefinition,
  ammo?: number,
}

export interface SpectatorInfoPlayerInfo {
  PlayerState?: number,
  PlayerInventory?: number,
  PlayerClientInfo?: number,
}

export interface SpectatorInfoExport extends RemoveIndex<Data> {
  PerPlayerInfo?: SpectatorInfoPlayerInfo[],
}

export interface RemoteClientInfoExport extends RemoveIndex<Data> {
  RemoteEventScore?: number,
}

export interface RemoteClientInfo extends RemoteClientInfoExport {
  actorId: number,
  hitMarkers: RemoteClientHitmarker[][],
}

export interface RemoteClientHitmarker {
  ScreenSpaceHitLocation: Vector2,
  bWasCriticalHit: boolean,
}

export interface RemoteClientHitmarkersExport extends RemoveIndex<Data> {
  ScreenSpaceHitLocations?: RemoteClientHitmarker[],
}

export interface SoccerGameExport extends RemoveIndex<Data> {
  Score_Team_A?: number,
  Score_Team_B?: number,
  ScoreLocation?: FVector,
  WinningTeam?: number,
  PlayerWhoScored?: number,
  bScoredWithToy?: boolean,
}

export interface SoccerGame extends SoccerGameExport {
  scoreHistory: {
    Score_Team_A: number,
    Score_Team_B: number,
  }[],
}

export interface SpeedSignExport extends RemoveIndex<Data> {
  VehicleSpeed?: number,
  bReplicateMovement?: boolean,
  ReplicatedMovement?: FRepMovement,
}

export interface SpeedSign extends SpeedSignExport {
  history: number[],
}

export interface SupplyDropExport extends RemoveIndex<Data> {
  Opened?: boolean,
  BalloonPopped?: boolean,
  ReplicatedMovement?: FRepMovement,
}

export interface VehicleSeat {
  Player: number,
  PlayerEntryTime: number,
  WeaponComponent: number,
  SeatIndex: number,
}

export interface VehicleSeatComponentExport extends RemoveIndex<Data> {
  PlayerSlots?: VehicleSeat[],
}

export interface VehicleExport extends RemoveIndex<Data> {
  Health?: number,
  ReplicatedMovement?: FRepMovement,
}

export interface Vehicle extends VehicleExport {
  type: string,
  seats: VehicleSeat[],
}

export interface HealthSetExport extends RemoveIndex<Data> {
  [handle: number]: number,
}

export interface ActiveGampeplayModifiersExport extends RemoveIndex<Data> {
  ModifierDef?: ItemDefinition,
}

export interface PlayerMarkerExport extends RemoveIndex<Data> {
  PlayerID?: number,
  BasePosition?: FVector,
}

export interface PlayerMarker extends PlayerMarkerExport {
  removed?: boolean,
}

export interface DefaultStates extends BaseStates {
  safeZones?: SafeZone,
  gameState?: GameState,
  containers?: CustomMap<Container>,
  players?: CustomMap<PlayerState>,
  pawns?: CustomMap<PlayerPawn | Labrador>,
  playerPawns?: CustomMap<PlayerPawn>,
  pawnChannelToStateChannel: CustomMap<number>,
  queuedPlayerPawns: CustomMap<PlayerPawn[]>,
  playerBuilds?: CustomMap<PlayerBuildExport>,
  pickups?: CustomMap<PickupExport>,
  llamas?: CustomMap<LlamaExport>,
  labradorLlamas?: CustomMap<Labrador>,
  inventories?: CustomMap<Inventory>,
  queuedSpectatorInfo?: CustomMap<SpectatorInfoPlayerInfo>,
  remoteClientInfo?: CustomMap<RemoteClientInfo>,
  soccerGames?: CustomMap<SoccerGame>,
  speedSigns?: CustomMap<SpeedSign>,
  supplyDrops?: CustomMap<SupplyDropExport>,
  vehicles?: CustomMap<Vehicle>,
  markers?: CustomMap<PlayerMarker>,
}

export interface DefaultResult extends BaseResult {
  gameData?: {
    activeGameplayModifiers?: string[],
    safeZones?: SafeZone[],
    gameState?: GameState,
    playlistInfo?: string,
    players?: PlayerState[],
  },
  mapData?: {
    containers?: Container[],
    playerBuilds?: PlayerBuildExport[],
    pickups?: PickupExport[],
    llamas?: LlamaExport[],
    labradorLlamas?: Labrador[],
    soccerGames?: SoccerGame[],
    speedSigns?: SpeedSign[],
    supplyDrops?: SupplyDropExport[],
    vehicles?: Vehicle[],
    markers?: PlayerMarker[],
  },
}
