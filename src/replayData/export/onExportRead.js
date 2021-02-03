const handlePlayerState = require("./FortPlayerState");
const handleGameState = require("./GameState");
const handlePlayerPawn = require("./PlayerPawn");
const handleSafezone = require("./SafezoneIndicator");

const onExportRead = (chIndex, value) => {
  switch (value.type) {
    case 'SafeZoneIndicator.SafeZoneIndicator_C':
      handleSafezone(chIndex, value);
      break;

    case 'PlayerPawn_Athena.PlayerPawn_Athena_C':
      handlePlayerPawn(chIndex, value);
      break;

    case 'FortniteGame.FortPlayerStateAthena':
      handlePlayerState(chIndex, value);
      break;

    case 'Athena_GameState.Athena_GameState_C':
      handleGameState(chIndex, value);
      break;
  }
};

module.exports = onExportRead;
