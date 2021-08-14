const handleLootLlama = (chIndex, llama, timeseconds, staticActorId, globalData) => {
  // TODO: handle labrador llama
  const gd = globalData;

  if (!gd.llamas[chIndex]) {
    const { x, y, z } = llama.ReplicatedMovement.location;

    const targetLlama = Object.entries(gd.llamas)
      .find(([, val]) => val.ReplicatedMovement.location.x === x
        && val.ReplicatedMovement.location.y === y
        && val.ReplicatedMovement.location.z === z);

    if (targetLlama) {
      // TODO: try to use closed channels to detect that
      gd.llamas[chIndex] = gd.llamas[targetLlama[0]];
    } else {
      if (!gd.result.mapData.llamas) {
        gd.result.mapData.llamas = [];
      }

      gd.result.mapData.llamas.push(llama);

      gd.llamas[chIndex] = llama;

      return;
    }
  }

  Object.entries(llama).forEach(([key, value]) => {
    if (value !== null) {
      gd.llamas[chIndex][key] = value;
    }
  });
};

module.exports = handleLootLlama;
