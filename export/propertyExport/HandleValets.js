const handleValets = (chIndex, value, timeSeconds, globalData) => {
  if (!globalData.result.mapData.vehicles.valets[chIndex]) {
    globalData.result.mapData.vehicles.valets[chIndex] = value;
    return;
  }

  Object.entries(value).forEach(([key, value]) => {
    if (value !== null) {
      globalData.result.mapData.vehicles.valets[chIndex][key] = value;
    }
  });
}

module.exports = handleValets;
