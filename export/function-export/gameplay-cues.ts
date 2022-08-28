import { PropertyExportFunction } from '$types/lib';
import { DefaultResult, DefaultStates, GameplayCueExport } from '$types/result-data';

export const handleGameplayCues: PropertyExportFunction<DefaultResult, DefaultStates, GameplayCueExport> = ({ actorId, data, timeSeconds, globalData, states }) => {
  if (!states.pawns[actorId]) {
    if (globalData.options.debug) {
      console.log('Received gameplay cue for not tracked pawn');
    }

    return;
  }

  states.pawns[actorId].gameplayCues.push({
    location: states.pawns[actorId]?.ReplicatedMovement?.location || null,
    gameplayCueTag: data.GameplayCueTag,
    timeSeconds,
  });
};
