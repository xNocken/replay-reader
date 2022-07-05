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
const handlePlayerPawnSpawn = require('./actor-spawn/handle-player-pawn');

const setEvents = ({
  actorDespawn,
  propertyExport,
  netDeltaRead,
  parsing,
  actorSpawn,
}, globalData,
) => {
  actorDespawn.on('container', handleContainerDespawn);

  actorSpawn.on('playerPawn', handlePlayerPawnSpawn);

  propertyExport.on('safeZone', handleSafezone);
  // propertyExport.on('safeZone', handleSafezoneFastForwarding);
  propertyExport.on('playerPawn', handlePlayerPawn);
  propertyExport.on('playerState', handlePlayerState);
  propertyExport.on('gameState', handleGameState);
  propertyExport.on('pickup', handlePickup);
  propertyExport.on('playerBuild', handlePlayerBuilds);
  propertyExport.on('vehicle', handleVehicles);
  propertyExport.on('speedSign', handleSpeedSign);
  propertyExport.on('container', handleContainer);
  propertyExport.on('healthSet', handleHealthSet);
  propertyExport.on('labrador', handleLabradorLlama);
  propertyExport.on('llama', handleLootLlama);
  propertyExport.on('supplyDrop', handleSupplyDrop);
  propertyExport.on('soccerGame', handleSoccerGame);
  propertyExport.on('inventory', handleInventoryProperty);
  propertyExport.on('broadcastRemoteClientInfo', handleRemoteClientInfo);
  propertyExport.on('broadcastSpectatorInfo', handleBroadcastSpectatorInfo);
  propertyExport.on('vehicleSeatComponent', handleVehicleSeatComponent);

  // functions
  propertyExport.on('batchedDamageCue', handleDamageCues);
  propertyExport.on('mapMarker', handleBroadcastMapMarker);
  propertyExport.on('hitMarkers', handleClientInfoHitMarkers);
  propertyExport.on('gameplayCue', handleGameplayCues);

  // class
  propertyExport.on('Athena_GameState_C_ClassNetCache', handlePlaylistInfo);

  netDeltaRead.on('activeGamplayModifier', handleActiveGameplayModifiers);
  netDeltaRead.on('inventory', handleInventory);

  if (globalData.debug) {
    parsing.on('channelOpened', ({ actor, globalData, states }) => {
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

  // parsing.on('channelClosed', console.log);
  // parsing.on('nextChunk', console.log);
  // parsing.on('nextFrame', console.log);
};

module.exports = setEvents;
