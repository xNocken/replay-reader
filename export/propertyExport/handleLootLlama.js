const handleLootLlama = ({ actor, data, result, states, changedProperties }) => {
  const actorId = actor.actorNetGUID.value;

  if (!states.llamas[actorId]) {
    result.mapData.llamas.push(data);

    states.llamas[actorId] = data;

    return;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    states.llamas[actorId][key] = data[key];
  }
};

module.exports = handleLootLlama;
