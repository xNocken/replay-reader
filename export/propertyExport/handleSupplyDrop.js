const handleSupplyDrop = (chIndex, supplyDrop, timeseconds, staticActorId, globalData) => {
  const gd = globalData;

  if (!gd.supplyDrops[chIndex]) {
    if (!gd.result.mapData.supplyDrops) {
      gd.result.mapData.supplyDrops = [];
    }

    gd.supplyDrops[chIndex] = supplyDrop;
    gd.result.mapData.supplyDrops.push(supplyDrop);

    return;
  }

  Object.entries(supplyDrop).forEach(([key, value]) => {
    if (value !== null) {
      gd.supplyDrops[chIndex][key] = value;
    }
  });
};

module.exports = handleSupplyDrop;
