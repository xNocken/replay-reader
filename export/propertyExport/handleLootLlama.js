const handleLootLlama = ({ chIndex, data, result, states }) => {
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

  Object.entries(data).forEach(([key, value]) => {
    if (value !== null) {
      states.llamas[chIndex][key] = value;
    }
  });
};

module.exports = handleLootLlama;
