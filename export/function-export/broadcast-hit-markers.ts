import { PropertyExportFunction } from '$types/lib';
import { DefaultResult, DefaultStates, RemoteClientHitmarkersExport } from '$types/result-data';

export const handleClientInfoHitMarkers: PropertyExportFunction<DefaultResult, DefaultStates, RemoteClientHitmarkersExport> = ({ data, states, actorId }) => {
  const clientInfo = states.remoteClientInfo[actorId];

  if (!clientInfo) {
    return;
  }

  if (data.ScreenSpaceHitLocations) {
    clientInfo.hitMarkers.push(data.ScreenSpaceHitLocations);
  }
};
