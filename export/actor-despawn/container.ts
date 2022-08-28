import { ActorDespawnExportFunction } from '$types/lib';
import { DefaultResult, DefaultStates } from '$types/result-data';

export const handleContainerDespawn: ActorDespawnExportFunction<DefaultResult, DefaultStates> = ({ staticActorId, states, actorId, result }) => {
  const gameState = states.gameState;
  let container = states.containers[actorId];

  if (!container) {
    container = {
      pathName: staticActorId,
    };

    states.containers[actorId] = container;
    result.mapData.containers.push(container);
  }

  container.destroyed = true;

  if (!gameState.inited || gameState.ReplicatedWorldTimeSeconds < gameState.WarmupCountdownEndTime) {
    container.despawned = true;
  }
};
