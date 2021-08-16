const handleFortPickup = ({ chIndex, data, result, states }) => {
  if (!states.pickups[chIndex]) {
    states.pickups[chIndex] = data;
    result.mapData.pickups.push(data);

    return;
  }

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null) {
      states.pickups[chIndex][key] = value;
    }
  });
};

module.exports = handleFortPickup;
