const handleChest = ({ staticActorId, states, actorId, result }) => {
  let chest = states.chests[actorId];

  if (!chest) {
    chest = {
      chestId: staticActorId,
    };

    states.chests[actorId] = chest;
    result.mapData.chests.push(chest);
  }

  chest.destroyed = true;

  if (!states.gameState.inited || states.gameState.ReplicatedWorldTimeSeconds < states.gameState.WarmupCountdownEndTime) {
    chest.despawned = true;
  }
};

module.exports = handleChest;
