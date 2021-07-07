const handleChests = require("./propertyExport/Chests");
const handleFortPickup = require("./propertyExport/FortPickup");
const handlePlayerState = require("./propertyExport/FortPlayerState");
const handleGameState = require("./propertyExport/GameState");
const handleFortBroadcastRemoteClientInfoMapMarker = require("./propertyExport/handleFortBroadCastRemoteClientInfoMapMarker");
const handleGameplayCues = require("./propertyExport/handleGameplayCues");
const handleHealthSet = require("./propertyExport/handleHealthSet");
const handleLabradorLlama = require("./propertyExport/handleLabradorLlama");
const handleLootLlama = require("./propertyExport/handleLootLlama");
const handlePlayerBuilds = require("./propertyExport/HandlePlayerBuilds");
const handleSoccerGame = require("./propertyExport/handleSoccerGame");
const handleSupplyDrop = require("./propertyExport/handleSupplyDrop");
const handleValets = require("./propertyExport/HandleValets");
const handlePlayerPawn = require("./propertyExport/PlayerPawn");
const handlePlaylistInfo = require("./propertyExport/PlaylistInfo");
const handleSafezone = require("./propertyExport/SafezoneIndicator");
const handleSpeedSign = require("./propertyExport/SpeedSign");

const onExportRead = (chIndex, value, timeseconds, mapObjectName, globalData) => {
  switch (value.type) {
    case 'SafeZoneIndicator.SafeZoneIndicator_C':
      handleSafezone(chIndex, value, timeseconds, globalData);
      break;

    case 'PlayerPawn_Athena.PlayerPawn_Athena_C':
      handlePlayerPawn(chIndex, value, timeseconds, globalData);
      break;

    case 'FortniteGame.FortPlayerStateAthena':
      handlePlayerState(chIndex, value, timeseconds, globalData);
      break;

    case 'Athena_GameState.Athena_GameState_C':
      handleGameState(chIndex, value, timeseconds, globalData);
      break;

    case 'FortniteGame.FortPickupAthena':
      handleFortPickup(chIndex, value, timeseconds, globalData);
      break;

    case 'Athena_GameState_C_ClassNetCache':
      handlePlaylistInfo(chIndex, value, timeseconds, globalData);
      break;

    case 'PlayerBuilds':
      handlePlayerBuilds(chIndex, value, timeseconds, globalData);
      break;

    case 'Valet':
      handleValets(chIndex, value, timeseconds, globalData);
      break;

    case 'BP_Athena_SpeedSign.BP_Athena_SpeedSign_C':
      handleSpeedSign(chIndex, value, timeseconds, mapObjectName, globalData)
      break;

    case 'Chests':
      handleChests(chIndex, value, timeseconds, mapObjectName, globalData);
      break;

    case 'FortniteGame.FortBroadcastRemoteClientInfo:ClientRemotePlayerRemoveMapMarker':
    case 'FortniteGame.FortBroadcastRemoteClientInfo:ClientRemotePlayerAddMapMarker':
      handleFortBroadcastRemoteClientInfoMapMarker(chIndex, value, timeseconds, globalData);
      break;

    case 'FortniteGame.FortRegenHealthSet':
      handleHealthSet(chIndex, value, timeseconds, globalData);
      break;

    case 'gameplayCue':
      handleGameplayCues(chIndex, value, timeseconds, globalData);
      break;

    case 'BP_AIPawn_Labrador.BP_AIPawn_Labrador_C':
      handleLabradorLlama(chIndex, value, timeseconds, globalData);
      break;

    case 'AthenaSupplyDrop_Llama.AthenaSupplyDrop_Llama_C':
      handleLootLlama(chIndex, value, timeseconds, globalData);
      break;

    case 'AthenaSupplyDrop.AthenaSupplyDrop_C':
      handleSupplyDrop(chIndex, value, timeseconds, globalData);
      break;

    case 'Athena_SoccerGame.Athena_SoccerGame_C':
      handleSoccerGame(mapObjectName, value, timeseconds, globalData);
      break;

    default:
      if (globalData.debug) {
        console.log('Unhandled export:', value.type)
      }
      break;
  }
};

module.exports = onExportRead;
