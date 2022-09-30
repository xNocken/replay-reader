import { NetFieldExportGroupConfig } from '../../types/nfe';

const GameStateCache: NetFieldExportGroupConfig = {
  path: "Athena_GameState_C_ClassNetCache",
  parseLevel: 1,
  type: "classNetCache",
  exports: {
    name: "playlistInfo",
    group: "gameData",
    type: "null",
  },
  properties: {
    CurrentPlaylistInfo: {
      type: "PlaylistInfo",
      parseType: "class",
      customExportName: 'playlistInfo',
    },
    ActiveGameplayModifiers: {
      type: "activeGamplayModifier",
      parseType: "netDeltaSerialize",
    },
  },
};

export default GameStateCache;
