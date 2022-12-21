import { FunctionCallFunction } from '../../types/lib';
import { DefaultResult, DefaultStates, PlayerMarkerExport } from '../../types/result-data';

type PlayerMarkerRecord = Record<keyof PlayerMarkerExport, PlayerMarkerExport[keyof PlayerMarkerExport]>;

export const handleBroadcastMapMarker: FunctionCallFunction<DefaultResult, DefaultStates, PlayerMarkerExport> = ({ actorId, data, result, states, changedProperties }) => {
  if (data.pathName.match('Remove')) {
    if (states.markers[actorId]) {
      states.markers[actorId].removed = true;
    }

    delete states.markers[actorId];

    return;
  }

  if (!states.markers[actorId]) {
    states.markers[actorId] = data;
    result.mapData.markers.push(data);

    return;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    (states.markers[actorId] as PlayerMarkerRecord)[key] = data[key];
  }
};
