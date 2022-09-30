import { handleContainerDespawn } from './actor-despawn/container';
import { handleContainer } from './property-export/container';
import { handleActiveGameplayModifiers } from './net-delta-export/active-gameplay-modifiers';
import { handleBroadcastMapMarker } from './function-export/broadcast-map-marker';
import { handlePickup } from './property-export/pickup';
import { handlePlayerState } from './property-export/player-state';
import { handleGameplayCues } from './function-export/gameplay-cues';
import { handleGameState } from './property-export/game-state';
import { handleHealthSet } from './property-export/components/health-set';
import { handleLabrador } from './property-export/labrador';
import { handlePlayerBuilds } from './property-export/player-builds';
import { handlePlayerPawn } from './property-export/player-pawn';
import { handlePlaylistInfo } from './property-export/playlist-info';
import { handleSafezoneIndicator } from './property-export/safezone-indicator';
import { handleSoccerGame } from './property-export/soccer-game';
import { handleSpeedSign } from './property-export/speed-sign';
import { handleSupplyDrop } from './property-export/supply-drop';
import { handleVehicles } from './property-export/vehicles';
import { handleInventory } from './net-delta-export/inventory';
import { handleInventoryProperty } from './property-export/inventory';
import { handleSafezoneIndicatorFastForwarding } from './property-export/safezone-indicator-fast-forwarding';
import { handleDamageCues } from './function-export/damage-cues';
import { handleRemoteClientInfo } from './property-export/broadcast-remote-client-info';
import { handleBroadcastSpectatorInfo } from './property-export/broadcast-spectator-info';
import { handleClientInfoHitMarkers } from './function-export/broadcast-hit-markers';
import { handleVehicleSeatComponent } from './property-export/components/vehicle-seat';
import { handlePlayerPawnSpawn } from './actor-spawn/player-pawn';
import { SetEvents } from '../types/lib';
import { DefaultResult, DefaultStates } from '../types/result-data';
import { handleLlama } from './property-export/llama';

export const setEvents: SetEvents<DefaultResult, DefaultStates> = ({
  actorDespawn,
  properties,
  netDelta,
  parsing,
  actorSpawn,
}) => {
  actorDespawn.on('container', handleContainerDespawn);

  actorSpawn.on('playerPawn', handlePlayerPawnSpawn);

  properties.on('safeZone', handleSafezoneIndicator);
  // propertyExport.on('safeZone', handleSafezoneIndicatorFastForwarding);
  properties.on('playerPawn', handlePlayerPawn);
  properties.on('playerState', handlePlayerState);
  properties.on('gameState', handleGameState);
  properties.on('pickup', handlePickup);
  properties.on('playerBuild', handlePlayerBuilds);
  properties.on('vehicle', handleVehicles);
  properties.on('speedSign', handleSpeedSign);
  properties.on('container', handleContainer);
  properties.on('healthSet', handleHealthSet);
  properties.on('labrador', handleLabrador);
  properties.on('supplyDrop', handleSupplyDrop);
  properties.on('soccerGame', handleSoccerGame);
  properties.on('inventory', handleInventoryProperty);
  properties.on('broadcastRemoteClientInfo', handleRemoteClientInfo);
  properties.on('broadcastSpectatorInfo', handleBroadcastSpectatorInfo);
  properties.on('vehicleSeatComponent', handleVehicleSeatComponent);
  properties.on('llama', handleLlama);

  // functions
  properties.on('batchedDamageCue', handleDamageCues);
  properties.on('mapMarker', handleBroadcastMapMarker);
  properties.on('hitMarkers', handleClientInfoHitMarkers);
  properties.on('gameplayCue', handleGameplayCues);

  // class
  properties.on('playlistInfo', handlePlaylistInfo);

  netDelta.on('activeGamplayModifier', handleActiveGameplayModifiers);
  netDelta.on('inventory', handleInventory);

  // parsing.on('channelClosed', console.log);
  // parsing.on('nextChunk', console.log);
  // parsing.on('nextFrame', console.log);
  // parsing.on('finished', console.log);
};
