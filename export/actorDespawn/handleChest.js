const handleChest = (mapObjectName, chIndex, globalData) => {
  globalData.result.notSpawnedChests[mapObjectName] = true;
};

module.exports = handleChest;
