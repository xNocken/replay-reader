const handleSpeedSign = ({ actorId, result, states, data, changedProperties }) => {
  let speedSign = states.speedSigns[actorId];

  if (!speedSign) {
    speedSign = {
      history: [],
    };

    states.speedSigns[actorId] = speedSign;
    result.mapData.speedSigns.push(speedSign);
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    speedSign[key] = data[key];
  }

  if (data.VehicleSpeed !== undefined) {
    speedSign.history.push(data.VehicleSpeed);
  }
};

module.exports = handleSpeedSign;
