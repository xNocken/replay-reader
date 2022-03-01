const handleFortBroadcastRemoteClientInfoMapMarker = ({ chIndex, data, result, states, changedProperties }) => {
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

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    states.markers[chIndex][key] = data[key];
  }
};

module.exports = handleFortBroadcastRemoteClientInfoMapMarker;
