const handleChest = (isOpenPacket, chIndex, timeSeconds, exportGroup, staticActorId, globalData) => {
  globalData.result.notSpawnedChests[staticActorId] = true;
};

module.exports = handleChest;
