const handleLootLlama = ({ chIndex, data, result, states, changedProperties }) => {
  if (!states.llamas[chIndex]) {
    const { x, y, z } = data.ReplicatedMovement.location;

    const targetLlama = Object.entries(states.llamas)
      .find(([, val]) => val.ReplicatedMovement.location.x === x
        && val.ReplicatedMovement.location.y === y
        && val.ReplicatedMovement.location.z === z);

    if (targetLlama) {
      // TODO: try to use closed channels to detect that
      states.llamas[chIndex] = states.llamas[targetLlama[0]];
    } else {
      result.mapData.llamas.push(data);

      states.llamas[chIndex] = data;

      return;
    }
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    states.llamas[chIndex][key] = data[key];
  }
};

module.exports = handleLootLlama;
