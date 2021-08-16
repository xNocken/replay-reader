const handleSpeedSign = ({ data, staticActorId, result, states }) => {
  if (!states.speedSigns[staticActorId]) {
    const newState = {
      history: [],
    };

    states.speedSigns[staticActorId] = newState;
    result.mapData.speedSigns.push(newState);
  }

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null) {
      states.speedSigns[staticActorId][key] = value;
    }
  });

  if (data.VehicleSpeed !== undefined) {
    states.speedSigns[staticActorId].history.push(data.VehicleSpeed);
  }
};

module.exports = handleSpeedSign;
