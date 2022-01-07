const handleSupplyDrop = ({ actor, data, states, result, changedProperties }) => {
  const actorId = actor.actorNetGUID.value;

  if (!states.supplyDrops[actorId]) {
    states.supplyDrops[actorId] = data;
    result.mapData.supplyDrops.push(data);

    return;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    states.supplyDrops[actorId][key] = data[key];
  }
};

module.exports = handleSupplyDrop;
