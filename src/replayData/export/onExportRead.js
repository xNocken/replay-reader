const handleChests = require("./Chests");
const handleFortPickup = require("./FortPickup");
const handlePlayerState = require("./FortPlayerState");
const handleGameState = require("./GameState");
const handleFortBroadcastRemoteClientInfoMapMarker = require("./handleFortBroadCastRemoteClientInfoMapMarker");
const handleHealthSet = require("./handleHealthSet");
const handlePlayerBuilds = require("./HandlePlayerBuilds");
const handleValets = require("./HandleValets");
const handlePlayerPawn = require("./PlayerPawn");
const handlePlaylistInfo = require("./PlaylistInfo");
const handleSafezone = require("./SafezoneIndicator");
const handleSpeedSign = require("./SpeedSign");

const onExportRead = (chIndex, value, timeseconds, globalData) => {
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
      handleSpeedSign(chIndex, value, timeseconds, globalData)
      break;

    case 'Chests':
      handleChests(chIndex, value, timeseconds, globalData);
      break;

    case 'FortniteGame.FortBroadcastRemoteClientInfo:ClientRemotePlayerRemoveMapMarker':
    case 'FortniteGame.FortBroadcastRemoteClientInfo:ClientRemotePlayerAddMapMarker':
      handleFortBroadcastRemoteClientInfoMapMarker(chIndex, value, timeseconds, globalData);
      break;

    case 'FortniteGame.FortRegenHealthSet':
      handleHealthSet(chIndex, value, timeseconds, globalData);
      break;

    default:
      if (globalData.debug) {
        console.log('Unhandled export:', value.type)
      }
      break;
  }
};

module.exports = onExportRead;
