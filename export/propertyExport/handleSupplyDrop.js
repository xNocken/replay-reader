const handleSupplyDrop = ({ chIndex, data, states, result, changedProperties }) => {
  if (!states.supplyDrops[chIndex]) {
    states.supplyDrops[chIndex] = data;
    result.mapData.supplyDrops.push(data);

    return;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    states.supplyDrops[chIndex][key] = data[key];
  }
};

module.exports = handleSupplyDrop;
