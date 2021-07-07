const handleChests = require("./propertyExport/handleChests");
const handleFortPickup = require("./propertyExport/handleFortPickup");
const handlePlayerState = require("./propertyExport/handleFortPlayerState");
const handleGameState = require("./propertyExport/handleGameState");
const handleFortBroadcastRemoteClientInfoMapMarker = require("./propertyExport/handleFortBroadCastRemoteClientInfoMapMarker");
const handleGameplayCues = require("./propertyExport/handleGameplayCues");
const handleHealthSet = require("./propertyExport/handleHealthSet");
const handleLabradorLlama = require("./propertyExport/handleLabradorLlama");
const handleLootLlama = require("./propertyExport/handleLootLlama");
const handlePlayerBuilds = require("./propertyExport/handlePlayerBuilds");
const handleSoccerGame = require("./propertyExport/handleSoccerGame");
const handleSupplyDrop = require("./propertyExport/handleSupplyDrop");
const handleValets = require("./propertyExport/handleValets");
const handlePlayerPawn = require("./propertyExport/handlePlayerPawn");
const handlePlaylistInfo = require("./propertyExport/handlePlaylistInfo");
const handleSafezone = require("./propertyExport/handleSafezoneIndicator");
const handleSpeedSign = require("./propertyExport/handleSpeedSign");

const onExportRead = (chIndex, value, timeseconds, mapObjectName, globalData) => {
  switch (value.type) {
    case 'SafeZoneIndicator.SafeZoneIndicator_C':
      handleSafezone(value, globalData);
      break;

    case 'PlayerPawn_Athena.PlayerPawn_Athena_C':
      handlePlayerPawn(chIndex, value, globalData);
      break;

    case 'FortniteGame.FortPlayerStateAthena':
      handlePlayerState(chIndex, value, globalData);
      break;

    case 'Athena_GameState.Athena_GameState_C':
      handleGameState(value, globalData);
      break;

    case 'FortniteGame.FortPickupAthena':
      handleFortPickup(chIndex, value, globalData);
      break;

    case 'Athena_GameState_C_ClassNetCache':
      handlePlaylistInfo(value, globalData);
      break;

    case 'PlayerBuilds':
      handlePlayerBuilds(chIndex, value, globalData);
      break;

    case 'Valet':
      handleValets(chIndex, value, globalData);
      break;

    case 'BP_Athena_SpeedSign.BP_Athena_SpeedSign_C':
      handleSpeedSign(mapObjectName, value, globalData)
      break;

    case 'Chests':
      handleChests(mapObjectName, value, globalData);
      break;

    case 'FortniteGame.FortBroadcastRemoteClientInfo:ClientRemotePlayerRemoveMapMarker':
    case 'FortniteGame.FortBroadcastRemoteClientInfo:ClientRemotePlayerAddMapMarker':
      handleFortBroadcastRemoteClientInfoMapMarker(chIndex, value, globalData);
      break;

    case 'FortniteGame.FortRegenHealthSet':
      handleHealthSet(chIndex, value, globalData);
      break;

    case 'gameplayCue':
      handleGameplayCues(chIndex, value, timeseconds, globalData);
      break;

    case 'BP_AIPawn_Labrador.BP_AIPawn_Labrador_C':
      handleLabradorLlama(chIndex, value, globalData);
      break;

    case 'AthenaSupplyDrop_Llama.AthenaSupplyDrop_Llama_C':
      handleLootLlama(chIndex, value, globalData);
      break;

    case 'AthenaSupplyDrop.AthenaSupplyDrop_C':
      handleSupplyDrop(chIndex, value, globalData);
      break;

    case 'Athena_SoccerGame.Athena_SoccerGame_C':
      handleSoccerGame(mapObjectName, value, globalData);
      break;

    default:
      if (globalData.debug) {
        console.log('Unhandled export:', value.type)
      }
      break;
  }
};

module.exports = onExportRead;
