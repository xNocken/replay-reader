const handlePickup = ({ actorId, data, result, states, changedProperties }) => {
  let pickup = states.pickups[actorId];

  if (!pickup) {
    pickup = {};

    states.pickups[actorId] = pickup;
    result.mapData.pickups.push(pickup);
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    pickup[key] = data[key];
  }
};

module.exports = handlePickup;
