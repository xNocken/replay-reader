const handleSpeedSign = (chIndex, sign, timeSeconds, globalData) => {
  if (!globalData.result.mapData.speedSigns[chIndex]) {
    globalData.result.mapData.speedSigns[chIndex] = [sign.VehicleSpeed];
  }

  if (sign.VehicleSpeed) {
    globalData.result.mapData.speedSigns[chIndex].push(sign.VehicleSpeed);
  }
};

module.exports = handleSpeedSign;
