const handleFortBroadcastRemoteClientInfoMapMarker = (chIndex, data, timeseconds, globalData) => {
  if (data.type.match('Remove')) {
    delete globalData.result.mapData.markers[chIndex];
    return;
  }

  if (!globalData.result.mapData.markers[chIndex]) {
    globalData.result.mapData.markers[chIndex] = data;
    return;
  }

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null) {
      globalData.result.mapData.markers[chIndex][key] = value;
    }
  });
};

module.exports = handleFortBroadcastRemoteClientInfoMapMarker;
