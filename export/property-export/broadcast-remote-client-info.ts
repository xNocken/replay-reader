import { PropertyExportFunction } from '../../types/lib';
import { DefaultResult, DefaultStates, RemoteClientInfoExport } from '../../types/result-data';

type RemoteClientInfoRecord = Record<keyof RemoteClientInfoExport, RemoteClientInfoExport[keyof RemoteClientInfoExport]>;

export const handleRemoteClientInfo: PropertyExportFunction<DefaultResult, DefaultStates, RemoteClientInfoExport> = ({ states, data, actorId, changedProperties }) => {
  let remoteClientInfo = states.remoteClientInfo[actorId];

  if (!remoteClientInfo) {
    remoteClientInfo = {
      actorId,
      hitMarkers: [],
    };

    states.remoteClientInfo[actorId] = remoteClientInfo;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    (remoteClientInfo as RemoteClientInfoRecord)[key] = data[key];
  }
};
