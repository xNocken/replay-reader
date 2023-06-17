import { PropertyExportFunction } from '../../types/lib';
import { DefaultResult, DefaultStates, PlayerState, PlayerStateExport } from '../../types/result-data';
const onlySpectatingPlayers: Record<number, boolean> = {};

type PlayerStateRecord = Record<keyof PlayerStateExport, PlayerStateExport[keyof PlayerStateExport]>;

const handleQueuedSpectatorInfo = (actorId: number, states: DefaultStates, player: PlayerState) => {
  if (!states.queuedSpectatorInfo) {
    return;
  }

  const spectatorInfo = states.queuedSpectatorInfo[actorId];

  if (!spectatorInfo) {
    return;
  }

  player.clientInfoId = spectatorInfo.PlayerClientInfo;
};

export const handlePlayerState: PropertyExportFunction<DefaultResult, DefaultStates, PlayerStateExport> = ({ actorId, data, states, result, changedProperties }) => {
  if (data.bOnlySpectator == true) {
    onlySpectatingPlayers[actorId] = true;

    return;
  }

  if (onlySpectatingPlayers[actorId]) {
    return;
  }

  let newPlayer = false;
  let playerData: PlayerState = states.players[actorId];

  if (!playerData) {
    playerData = {
      actorId,
      damageDealt: 0,
    };

    states.players[actorId] = playerData;
    result.gameData.players.push(playerData);

    newPlayer = true;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    (playerData as PlayerStateRecord)[key] = data[key];
  }

  if (data.PlayerNamePrivate_encrypted && data.PlayerNamePrivate) {
    const name = data.PlayerNamePrivate;

    playerData.PlayerNamePrivate = name.split('').map((a, i) => String.fromCharCode(a.charCodeAt(0) + ((name.length % 4 * 3 % 8 + 1 + i) * 3 % 8))).join('');
  }

  if (newPlayer) {
    handleQueuedSpectatorInfo(actorId, states, playerData);
  }

  if (playerData.clientInfoId && !playerData.remoteClientInfo) {
    const clientPlayerData = states.remoteClientInfo[playerData.clientInfoId];

    if (clientPlayerData) {
      playerData.remoteClientInfo = clientPlayerData;
    }
  }
};