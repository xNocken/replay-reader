import { FVector, Vector4 } from './lib';

export interface ElimPlayer {
  name: string;
  rotation?: Vector4,
  location?: FVector,
  scale?: FVector,
}

export interface PlayerElimEvent {
  eliminated: string,
  eliminator: string,
  gunType: string | number,
  knocked: boolean,
}

export interface MatchStatsEvent {
  accuracy: number,
  assists: number,
  eliminations: number,
  weaponDamage: number,
  otherDamage: number,
  revives: number,
  damageTaken: number,
  damageToStructures: number,
  materialsGathered: number,
  materialsUsed: number,
  totalTraveled: number,
  damageToPlayers: number,
  placement: number,
  totalPlayers: number,
}

export interface GFPEvent {
  moduleId: string,
  moduleVersion?: number,
  artifactId?: string,
}

export interface SafeZone {
  x: number,
  y: number,
  z: number,
  radius: number,
}

export interface DeathInfo {
  id: string,
  reason: string,
  time: number,
}

export interface PlayerPosition {
  x: number,
  y: number,
  z: number,
  movementType?: string,
}

export interface PlayerPositionMap {
  [time: number]: PlayerPosition;
}

export interface PlayerKill {
  playerId: string,
  reason: string,
  knocked: boolean,
  location: FVector,
  time: number,
}

export interface Player {
  id: string,
  positions: PlayerPositionMap,
  killScore: number,
  kills: PlayerKill[],
  knockInfo?: DeathInfo,
  elimInfo?: DeathInfo,
}

export interface Events {
  /** contains a list of all positions where a chest has spawned */
  chests: FVector[],
  /** contains a list of all safe zones from the game */
  safeZones: SafeZone[],
  /** contains a list of all players in the game and where they were */
  players: Player[],
  /** contains information about the recording player */
  matchStats: MatchStatsEvent,
  /** contains a list of GFP that are required to watch the replay */
  gfp: GFPEvent[],
}

export interface GlobalDataEvents {
  chests: FVector[],
  safeZones: SafeZone[],
  players: {
    [id: string]: Player,
  },
  matchStats?: MatchStatsEvent,
  gfp?: GFPEvent[],
  timecode?: Date,
}
