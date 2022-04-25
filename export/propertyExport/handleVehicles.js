const handleVehicles = ({ actorId, data, states, result, changedProperties }) => {
  let vehicle = states.vehicles[actorId];

  if (!vehicle) {
    vehicle = {
      type: states.actorToPath[actorId],
      seats: [],
    };

    states.vehicles[actorId] = vehicle;
    result.mapData.vehicles.push(vehicle);
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    states.vehicles[actorId][key] = data[key];
  }
}

module.exports = handleVehicles;
