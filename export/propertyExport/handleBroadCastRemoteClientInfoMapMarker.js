const handleFortBroadcastRemoteClientInfoMapMarker = ({ chIndex, data, result, states }) => {
  if (data.type.match('Remove')) {
    if (states.markers[chIndex]) {
      states.markers[chIndex].removed = true;
    }

    delete states.markers[chIndex];
    return;
  }

  if (!states.markers[chIndex]) {
    states.markers[chIndex] = data;
    result.gameData.markers.push(data);
    return;
  }

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null) {
      states.markers[chIndex][key] = value;
    }
  });
};

module.exports = handleFortBroadcastRemoteClientInfoMapMarker;
