const handleFortPickup = require("./FortPickup");
const handlePlayerState = require("./FortPlayerState");
const handleGameState = require("./GameState");
const handlePlayerPawn = require("./PlayerPawn");
const handlePlaylistInfo = require("./PlaylistInfo");
const handleSafezone = require("./SafezoneIndicator");

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

    default:
      break;
  }
};

module.exports = onExportRead;
