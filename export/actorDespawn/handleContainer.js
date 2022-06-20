const handleContainerDespawn = ({ staticActorId, states, actorId, result }) => {
  let container = states.containers[actorId];

  if (!container) {
    container = {
      chestId: staticActorId,
    };

    states.containers[actorId] = container;
    result.mapData.containers.push(container);
  }

  container.destroyed = true;

  if (!states.gameState.inited || states.gameState.ReplicatedWorldTimeSeconds < states.gameState.WarmupCountdownEndTime) {
    container.despawned = true;
  }
};

module.exports = handleContainerDespawn;
