const handleVehicles = ({ actorId, data, states, result, changedProperties }) => {
  if (!states.vehicles[actorId]) {
    states.vehicles[actorId] = data;
    result.mapData.vehicles.push(data);

    return;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    states.vehicles[actorId][key] = data[key];
  }
}

module.exports = handleVehicles;
