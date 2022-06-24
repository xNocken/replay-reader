const handleFortBroadcastRemoteClientInfoMapMarker = ({ actorId, data, result, states, changedProperties }) => {
  if (data.pathName.match('Remove')) {
    if (states.markers[actorId]) {
      states.markers[actorId].removed = true;
    }

    delete states.markers[actorId];

    return;
  }

  if (!states.markers[actorId]) {
    states.markers[actorId] = data;
    result.gameData.markers.push(data);

    return;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    states.markers[actorId][key] = data[key];
  }
};

module.exports = handleFortBroadcastRemoteClientInfoMapMarker;
