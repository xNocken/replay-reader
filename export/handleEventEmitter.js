const handleChest = require('./actorDespawn/handleChest');
const handleActiveGameplayModifiers = require('./netDeltaExport/handleActiveGameplayModifiers');
const handleChests = require('./propertyExport/handleChests');
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

const handleEventEmitter = ({ actorDespawnEmitter, propertyExportEmitter, netDeltaReadEmitter, parsingEmitter }) => {
  actorDespawnEmitter.on('Tiered_Chest_Athena.Tiered_Chest_Athena_C', handleChest);

  propertyExportEmitter.on('SafeZoneIndicator.SafeZoneIndicator_C', handleSafezone);
  // propertyExportEmitter.on('SafeZoneIndicator.SafeZoneIndicator_C', handleSafezoneFastForwarding);
  propertyExportEmitter.on('PlayerPawn_Athena.PlayerPawn_Athena_C', handlePlayerPawn);
  propertyExportEmitter.on('FortniteGame.FortPawn:NetMulticast_Athena_BatchedDamageCues', handleDamageCues);
  propertyExportEmitter.on('FortniteGame.FortPlayerStateAthena', handlePlayerState);
  propertyExportEmitter.on('Athena_GameState.Athena_GameState_C', handleGameState);
  propertyExportEmitter.on('FortniteGame.FortPickupAthena', handlePickup);
  propertyExportEmitter.on('Athena_GameState_C_ClassNetCache', handlePlaylistInfo);
  propertyExportEmitter.on('PlayerBuilds', handlePlayerBuilds);
  propertyExportEmitter.on('Vehicles', handleVehicles);
  propertyExportEmitter.on('BP_Athena_SpeedSign.BP_Athena_SpeedSign_C', handleSpeedSign);
  propertyExportEmitter.on('Chests', handleChests);
  propertyExportEmitter.on('FortniteGame.FortBroadcastRemoteClientInfo:ClientRemotePlayerAddMapMarker', handleBroadcastRemoteClientInfoMapMarker);
  propertyExportEmitter.on('FortniteGame.FortBroadcastRemoteClientInfo:ClientRemotePlayerRemoveMapMarker', handleBroadcastRemoteClientInfoMapMarker);
  propertyExportEmitter.on('FortniteGame.FortBroadcastRemoteClientInfo:ClientRemotePlayerHitMarkers', handleClientInfoHitMarkers);
  propertyExportEmitter.on('FortniteGame.FortRegenHealthSet', handleHealthSet);
  propertyExportEmitter.on('gameplayCue', handleGameplayCues);
  propertyExportEmitter.on('BP_AIPawn_Labrador.BP_AIPawn_Labrador_C', handleLabradorLlama);
  propertyExportEmitter.on('AthenaSupplyDrop_Llama.AthenaSupplyDrop_Llama_C', handleLootLlama);
  propertyExportEmitter.on('AthenaSupplyDrop.AthenaSupplyDrop_C', handleSupplyDrop);
  propertyExportEmitter.on('Athena_SoccerGame.Athena_SoccerGame_C', handleSoccerGame);
  propertyExportEmitter.on('FortniteGame.FortInventory', handleInventoryProperty)
  propertyExportEmitter.on('FortniteGame.FortBroadcastRemoteClientInfo', handleRemoteClientInfo);
  propertyExportEmitter.on('FortniteGame.FortBroadcastSpectatorInfo', handleFortBroadcastSpectatorInfo);
  propertyExportEmitter.on('FortniteGame.FortVehicleSeatComponent', handleVehicleSeatComponent);

  netDeltaReadEmitter.on('FortniteGame.ActiveGameplayModifier', handleActiveGameplayModifiers)
  netDeltaReadEmitter.on('FortniteGame.FortInventory', handleInventory);

  // parsingEmitter.on('channelOpened', console.log);
  // parsingEmitter.on('channelClosed', console.log);
  // parsingEmitter.on('nextChunk', console.log);
  // parsingEmitter.on('nextFrame', console.log);
};

module.exports = handleEventEmitter;
