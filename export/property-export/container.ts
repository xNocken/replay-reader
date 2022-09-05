import { PropertyExportFunction } from "../../types/lib";
import { ContainerExport, DefaultResult, DefaultStates } from "../../types/result-data";

type ContainerRecord = Record<keyof ContainerExport, ContainerExport[keyof ContainerExport]>;

export const handleContainer: PropertyExportFunction<DefaultResult, DefaultStates, ContainerExport> = ({ data, actorId, staticActorId, result, states, changedProperties }) => {
  let container = states.containers[actorId];

  if (!container) {
    container = {
      pathName: staticActorId,
    };

    states.containers[actorId] = container;
    result.mapData.containers.push(container);
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    (container as ContainerRecord)[key] = data[key];
  }
};
