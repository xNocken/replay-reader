const handleFortPickup = ({ actor, data, result, states, changedProperties }) => {
  const actorId = actor.actorNetGUID.value;

  if (!states.pickups[actorId]) {
    states.pickups[actorId] = data;
    result.mapData.pickups.push(data);

    return;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    states.pickups[actorId][key] = data[key];
  }
};

module.exports = handleFortPickup;
