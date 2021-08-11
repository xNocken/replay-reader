const handleSpeedSign = (chIndex, sign, timeseconds, mapObjectName, globalData) => {
  if (!globalData.result.mapData.speedSigns[mapObjectName]) {
    globalData.result.mapData.speedSigns[mapObjectName] = { history: [] };
  }

  Object.entries(sign).forEach(([key, value]) => {
    if (value !== null) {
      globalData.result.mapData.speedSigns[mapObjectName][key] = value;
    }
  });

  if (sign.VehicleSpeed !== undefined) {
    globalData.result.mapData.speedSigns[mapObjectName].history.push(sign.VehicleSpeed);
  }
};

module.exports = handleSpeedSign;
