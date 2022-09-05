import { PropertyExportFunction } from '../../types/lib';
import { DefaultResult, DefaultStates, LabradorExport } from '../../types/result-data';

type LabradorRecord = Record<keyof LabradorExport, LabradorExport[keyof LabradorExport]>;

export const handleLabrador: PropertyExportFunction<DefaultResult, DefaultStates, LabradorExport> = ({ actorId, data, states, result, changedProperties }) => {
  if (!states.labradorLlamas[actorId]) {
    states.pawns[actorId] = data;
    states.labradorLlamas[actorId] = data;
    result.mapData.labradorLlamas.push(data);
  }

  const currentLlama = states.labradorLlamas[actorId];

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    (currentLlama as LabradorRecord)[key] = data[key];
  }

  const gameplayCues = currentLlama.gameplayCues;

  if (!gameplayCues) {
    return;
  }

  const latestGameplayCueTag = gameplayCues[gameplayCues.length - 1];

  if (latestGameplayCueTag && latestGameplayCueTag.gameplayCueTag) {
    switch (latestGameplayCueTag.gameplayCueTag.tagName) {
      case 'GameplayCue.Labrador.Disappear':
        currentLlama.bIsDisappeared = true;
        break;

      case 'GameplayCue.Labrador.Leak':
        currentLlama.bIsRunning = true;
        break;

      case 'GameplayCue.Labrador.Anticipation':
        currentLlama.bIsDisappearing = true;
        break;

      default:
        break;
    }
  }
};
