const handleContainerDespawn = ({ staticActorId, states, actorId, result }) => {
  const gameState = states.gameState;
  let container = states.containers[actorId];

  if (!container) {
    container = {
      chestId: staticActorId,
    };

    states.containers[actorId] = container;
    result.mapData.containers.push(container);
  }

  container.destroyed = true;

  if (!gameState.inited || gameState.ReplicatedWorldTimeSeconds < gameState.WarmupCountdownEndTime) {
    container.despawned = true;
  }
};

module.exports = handleContainerDespawn;
