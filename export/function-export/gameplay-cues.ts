import { FunctionCallFunction } from '../../types/lib';
import { DefaultResult, DefaultStates, GameplayCueExport } from '../../types/result-data';

export const handleGameplayCues: FunctionCallFunction<DefaultResult, DefaultStates, GameplayCueExport> = ({ actorId, data, timeSeconds, states, logger, changedProperties }) => {
  if (!states.pawns[actorId]) {
    logger.warn('Received gameplay cue for not tracked pawn');

    return;
  }

  states.pawns[actorId].gameplayCues.push({
    location: states.pawns[actorId]?.ReplicatedMovement?.location || null,
    gameplayCueTag: data.GameplayCueTag,
    timeSeconds,
  });
};
