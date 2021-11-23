const handleFortPickup = ({ chIndex, data, result, states, changedProperties }) => {
  if (!states.pickups[chIndex]) {
    states.pickups[chIndex] = data;
    result.mapData.pickups.push(data);

    return;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    states.pickups[chIndex][key] = data[key];
  }
};

module.exports = handleFortPickup;
