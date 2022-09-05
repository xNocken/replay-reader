import { NetFieldExportGroupConfig } from '../../types/lib';

const GameStateCache: NetFieldExportGroupConfig = {
  path: "Athena_GameState_C_ClassNetCache",
  parseLevel: 1,
  type: "ClassNetCache",
  exports: {
    name: "playlistInfo",
    group: "gameData",
    type: "null",
  },
  properties: {
    CurrentPlaylistInfo: {
      type: "PlaylistInfo",
      parseType: "class",
    },
    ActiveGameplayModifiers: {
      type: "activeGamplayModifier",
      parseType: "netDeltaSerialize",
    },
  },
};

export default GameStateCache;
