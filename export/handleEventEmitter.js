const handleContainerDespawn = require('./actorDespawn/handleContainer');
const handleActiveGameplayModifiers = require('./netDeltaExport/handleActiveGameplayModifiers');
const handleContainer = require('./propertyExport/handleContainer');
const handleBroadcastRemoteClientInfoMapMarker = require('./rpcExport/functions/handleBroadCastRemoteClientInfoMapMarker');
const handlePickup = require('./propertyExport/handlePickup');
const handlePlayerState = require('./propertyExport/handlePlayerState');
const handleGameplayCues = require('./rpcExport/functions/handleGameplayCues');
const handleGameState = require('./propertyExport/handleGameState');
const handleHealthSet = require('./propertyExport/handleHealthSet');
const handleLabradorLlama = require('./propertyExport/handleLabradorLlama');
const handleLootLlama = require('./propertyExport/handleLootLlama');
const handlePlayerBuilds = require('./propertyExport/handlePlayerBuilds');
const handlePlayerPawn = require('./propertyExport/handlePlayerPawn');
const handlePlaylistInfo = require('./propertyExport/handlePlaylistInfo');
const handleSafezone = require('./propertyExport/handleSafezoneIndicator');
const handleSoccerGame = require('./propertyExport/handleSoccerGame');
const handleSpeedSign = require('./propertyExport/handleSpeedSign');
const handleSupplyDrop = require('./propertyExport/handleSupplyDrop');
const handleVehicles = require('./propertyExport/handleVehicles');
const handleInventory = require('./netDeltaExport/handleInventory');
const handleInventoryProperty = require('./propertyExport/handleInventory');
const handleSafezoneFastForwarding = require('./propertyExport/handleSafezoneIndicatorFastForwarding');
const handleDamageCues = require('./rpcExport/functions/handleDamageCues');
const handleRemoteClientInfo = require('./propertyExport/handleRemoteClientInfo');
const handleFortBroadcastSpectatorInfo = require('./propertyExport/handleFortBroadcastSpectatorInfo');
const handleClientInfoHitMarkers = require('./rpcExport/functions/handleClientInfoHitMarkers');
const handleVehicleSeatComponent = require('./propertyExport/handleVehicleSeatComponent');

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
  propertyExportEmitter.on('broadcastSpectatorInfo', handleFortBroadcastSpectatorInfo);
  propertyExportEmitter.on('vehicleSeatComponent', handleVehicleSeatComponent);

  // functions
  propertyExportEmitter.on('batchedDamageCue', handleDamageCues);
  propertyExportEmitter.on('mapMarker', handleBroadcastRemoteClientInfoMapMarker);
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
