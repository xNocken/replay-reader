const handleSpeedSign = ({ actor, result, states, data, changedProperties }) => {
  const actorId = actor.actorNetGUID.value;

  if (!states.speedSigns[actorId]) {
    const newState = {
      history: [],
    };

    states.speedSigns[actorId] = newState;
    result.mapData.speedSigns.push(newState);
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    states.speedSigns[actorId][key] = data[key];
  }

  if (data.VehicleSpeed !== undefined) {
    states.speedSigns[actorId].history.push(data.VehicleSpeed);
  }
};

module.exports = handleSpeedSign;
