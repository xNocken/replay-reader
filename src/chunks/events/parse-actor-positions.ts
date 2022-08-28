import { BaseResult, BaseStates } from '$types/lib';
import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';
import { parsePosition } from './util/parse-position';

export const actorPositions = <ResultType extends BaseResult>(globalData: GlobalData<ResultType>, replay: Replay) => {
  const version = replay.readInt32();
  const count = replay.readUInt32();

  for (let i = 0; i < count; i += 1) {
    globalData.eventData.chests.push(parsePosition(replay));
  }
};
