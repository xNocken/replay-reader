const handleContainerDespawn = require('./actor-despawn/handle-container');
const handleContainer = require('./property-export/handle-container');
const handleActiveGameplayModifiers = require('./net-delta-export/handle-active-gameplay-modifiers');
const handleBroadcastMapMarker = require('./function-export/handle-broadcast-map-marker');
const handlePickup = require('./property-export/handle-pickup');
const handlePlayerState = require('./property-export/handle-player-state');
const handleGameplayCues = require('./function-export/handle-gameplay-cues');
const handleGameState = require('./property-export/handle-game-state');
const handleHealthSet = require('./property-export/components/handle-health-set');
const handleLabradorLlama = require('./property-export/handle-labrador');
const handleLootLlama = require('./property-export/handle-llama');
const handlePlayerBuilds = require('./property-export/handle-player-builds');
const handlePlayerPawn = require('./property-export/handle-player-pawn');
const handlePlaylistInfo = require('./property-export/handle-playlist-info');
const handleSafezone = require('./property-export/handle-safezone-indicator');
const handleSoccerGame = require('./property-export/handle-soccer-game');
const handleSpeedSign = require('./property-export/handle-speed-sign');
const handleSupplyDrop = require('./property-export/handle-supply-drop');
const handleVehicles = require('./property-export/handle-vehicles');
const handleInventory = require('./net-delta-export/handle-inventory');
const handleInventoryProperty = require('./property-export/handle-inventory');
const handleSafezoneFastForwarding = require('./property-export/handle-safezone-indicator-fast-forwarding');
const handleDamageCues = require('./function-export/handle-damage-cues');
const handleRemoteClientInfo = require('./property-export/handle-broadcast-remote-client-info');
const handleBroadcastSpectatorInfo = require('./property-export/handle-broadcast-spectator-info');
const handleClientInfoHitMarkers = require('./function-export/handle-broadcast-hit-markers');
const handleVehicleSeatComponent = require('./property-export/components/handle-vehicle-seat');

const handleEventEmitter = (
  { actorDespawnEmitter, propertyExportEmitter, netDeltaReadEmitter, parsingEmitter },
  globalData,
) => {
  actorDespawnEmitter.on('container', handleContainerDespawn);

  propertyExportEmitter.on('safeZone', handleSafezone);
  // propertyExportEmitter.on('safeZone', handleSafezoneFastForwarding);
  propertyExportEmitter.on('playerPawn', handlePlayerPawn);
  propertyExportEmitter.on('playerState', handlePlayerState);
  propertyExportEmitter.on('gameState', handleGameState);
  propertyExportEmitter.on('pickup', handlePickup);
  propertyExportEmitter.on('playerBuild', handlePlayerBuilds);
  propertyExportEmitter.on('vehicle', handleVehicles);
  propertyExportEmitter.on('speedSign', handleSpeedSign);
  propertyExportEmitter.on('container', handleContainer);
  propertyExportEmitter.on('healthSet', handleHealthSet);
  propertyExportEmitter.on('labrador', handleLabradorLlama);
  propertyExportEmitter.on('llama', handleLootLlama);
  propertyExportEmitter.on('supplyDrop', handleSupplyDrop);
  propertyExportEmitter.on('soccerGame', handleSoccerGame);
  propertyExportEmitter.on('inventory', handleInventoryProperty);
  propertyExportEmitter.on('broadcastRemoteClientInfo', handleRemoteClientInfo);
  propertyExportEmitter.on('broadcastSpectatorInfo', handleBroadcastSpectatorInfo);
  propertyExportEmitter.on('vehicleSeatComponent', handleVehicleSeatComponent);

  // functions
  propertyExportEmitter.on('batchedDamageCue', handleDamageCues);
  propertyExportEmitter.on('mapMarker', handleBroadcastMapMarker);
  propertyExportEmitter.on('hitMarkers', handleClientInfoHitMarkers);
  propertyExportEmitter.on('gameplayCue', handleGameplayCues);

  // class
  propertyExportEmitter.on('Athena_GameState_C_ClassNetCache', handlePlaylistInfo);

  netDeltaReadEmitter.on('activeGamplayModifier', handleActiveGameplayModifiers);
  netDeltaReadEmitter.on('inventory', handleInventory);

  if (globalData.debug) {
    parsingEmitter.on('channelOpened', ({ actor, globalData, states }) => {
      let repObject = 0;

      if (actor.actorNetGUID.isDynamic()) {
        repObject = actor.archetype.value;
      } else {
        repObject = actor.actorNetGUID.value;
      }

      const path = globalData.netGuidCache.tryGetFullPathName(repObject);

      states.actorToPath[actor.actorNetGUID.value] = path;
    });
  }

  // parsingEmitter.on('channelClosed', console.log);
  // parsingEmitter.on('nextChunk', console.log);
  // parsingEmitter.on('nextFrame', console.log);
};

module.exports = handleEventEmitter;
