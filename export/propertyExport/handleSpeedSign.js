const handleSpeedSign = (chIndex, sign, timeseconds, staticActorId, globalData) => {
  if (!globalData.result.mapData.speedSigns[staticActorId]) {
    globalData.result.mapData.speedSigns[staticActorId] = { history: [] };
  }

  Object.entries(sign).forEach(([key, value]) => {
    if (value !== null) {
      globalData.result.mapData.speedSigns[staticActorId][key] = value;
    }
  });

  if (sign.VehicleSpeed !== undefined) {
    globalData.result.mapData.speedSigns[staticActorId].history.push(sign.VehicleSpeed);
  }
};

module.exports = handleSpeedSign;
