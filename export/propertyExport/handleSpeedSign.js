const handleSpeedSign = ({ data, staticActorId, result, states, changedProperties }) => {
  if (!states.speedSigns[staticActorId]) {
    const newState = {
      history: [],
    };

    states.speedSigns[staticActorId] = newState;
    result.mapData.speedSigns.push(newState);
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    states.speedSigns[staticActorId][key] = data[key];
  }

  if (data.VehicleSpeed !== undefined) {
    states.speedSigns[staticActorId].history.push(data.VehicleSpeed);
  }
};

module.exports = handleSpeedSign;
