import { BaseResult, BaseStates } from '$types/lib';
import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';

export const parseTimecode = <ResultType extends BaseResult>(globalData: GlobalData<ResultType>, replay: Replay) => {
  const version = replay.readInt32();

  globalData.eventData.timecode = replay.readDate();
};
