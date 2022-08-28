import { PropertyExportFunction } from '$types/lib';
import { DefaultResult, DefaultStates, SpectatorInfoExport } from '$types/result-data';

export const handleBroadcastSpectatorInfo: PropertyExportFunction<DefaultResult, DefaultStates, SpectatorInfoExport> = ({ data, states }) => {
  data.PerPlayerInfo.forEach((playerData) => {
    const { PlayerState } = playerData;

    if (PlayerState && states.players) {
      const player = states.players[PlayerState];

      if (player) {
        player.clientInfoId = playerData.PlayerClientInfo;
      } else {
        states.queuedSpectatorInfo[PlayerState] = playerData;
      }
    }
  });
};
