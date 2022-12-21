import { FunctionCallFunction } from '../../types/lib';
import { DefaultResult, DefaultStates } from '../../types/result-data';

export const handleSuccessfulBuildingEdit: FunctionCallFunction<DefaultResult, DefaultStates> = ({ actorId, states }) => {
  if (!states.playerPawns[actorId]) {
    return;
  }

  states.playerPawns[actorId].successfulBuildingEdits += 1;
};
