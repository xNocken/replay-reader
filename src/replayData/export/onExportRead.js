const PlaylistInfo = require("../../../Classes/PlaylistInfo");
const handleFortPickup = require("./FortPickup");
const handlePlayerState = require("./FortPlayerState");
const handleGameState = require("./GameState");
const handlePlayerPawn = require("./PlayerPawn");
const handlePlaylistInfo = require("./PlaylistInfo");
const handleSafezone = require("./SafezoneIndicator");

const onExportRead = (chIndex, value, timeseconds) => {
  switch (value.type) {
    case 'SafeZoneIndicator.SafeZoneIndicator_C':
      handleSafezone(chIndex, value, timeseconds);
      break;

    case 'PlayerPawn_Athena.PlayerPawn_Athena_C':
      handlePlayerPawn(chIndex, value, timeseconds);
      break;

    case 'FortniteGame.FortPlayerStateAthena':
      handlePlayerState(chIndex, value, timeseconds);
      break;

    case 'Athena_GameState.Athena_GameState_C':
      handleGameState(chIndex, value, timeseconds);
      break;

    case 'FortniteGame.FortPickupAthena':
      handleFortPickup(chIndex, value, timeseconds);
      break;

    default:
      switch (true) {
        case value instanceof PlaylistInfo:
          handlePlaylistInfo(chIndex, value, timeseconds);
          break;
      }
      break;
  }
};

module.exports = onExportRead;
