const handleSupplyDrop = ({ chIndex, data, states, result }) => {
  if (!states.supplyDrops[chIndex]) {
    states.supplyDrops[chIndex] = data;
    result.mapData.supplyDrops.push(data);

    return;
  }

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null) {
      states.supplyDrops[chIndex][key] = value;
    }
  });
};

module.exports = handleSupplyDrop;
