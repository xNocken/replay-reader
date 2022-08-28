import { PropertyExportFunction } from '$types/lib';
import { DefaultResult, DefaultStates, PlayerBuildExport } from '$types/result-data';

type PlayerBuildRecord = Record<keyof PlayerBuildExport, PlayerBuildExport[keyof PlayerBuildExport]>;

export const handlePlayerBuilds: PropertyExportFunction<DefaultResult, DefaultStates, PlayerBuildExport> = ({ actorId, data, states, result, changedProperties }) => {
  let playerBuild = states.playerBuilds[actorId];

  if (!playerBuild) {
    playerBuild = {};

    states.playerBuilds[actorId] = playerBuild;
    result.mapData.playerBuilds.push(playerBuild);
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    (playerBuild as PlayerBuildRecord)[key] = data[key];
  }
};
