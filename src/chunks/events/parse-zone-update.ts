import { BaseResult, BaseStates } from '$types/lib';
import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';

export const parseZoneUpdate = <ResultType extends BaseResult>(globalData: GlobalData<ResultType>, replay: Replay) => {
  const version = replay.readInt32();

  globalData.eventData.safeZones.push({
    x: replay.readFloat32(),
    y: replay.readFloat32(),
    z: replay.readFloat32(),
    radius: replay.readFloat32(),
  });
}
