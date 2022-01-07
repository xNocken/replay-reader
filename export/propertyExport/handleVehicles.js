const handleVehicles = ({ actor, data, states, result, changedProperties }) => {
  const actorId = actor.actorNetGUID.value;

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
