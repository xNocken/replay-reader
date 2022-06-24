const handleSupplyDrop = ({ actorId, data, states, result, changedProperties }) => {
  let supplyDrop = states.supplyDrops[actorId];

  if (!supplyDrop) {
    supplyDrop = {};

    states.supplyDrops[actorId] = supplyDrop;
    result.mapData.supplyDrops.push(supplyDrop);

    return;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    supplyDrop[key] = data[key];
  }
};

module.exports = handleSupplyDrop;
