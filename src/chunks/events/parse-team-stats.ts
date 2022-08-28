import { BaseResult, BaseStates } from '$types/lib';
import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';

export const parseTeamStats = <ResultType extends BaseResult>(globalData: GlobalData<ResultType>, replay: Replay) => {
  const { matchStats } = globalData.eventData;
  const version = replay.readInt32();

  matchStats.placement = replay.readUInt32();
  matchStats.totalPlayers = replay.readUInt32();
}
