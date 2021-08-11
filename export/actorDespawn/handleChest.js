const handleChest = (isOpenPacket, chIndex, timeSeconds, exportGroup, mapObjectName, globalData) => {
  globalData.result.notSpawnedChests[mapObjectName] = true;
};

module.exports = handleChest;
