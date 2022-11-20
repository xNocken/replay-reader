import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';
import { readNetGuid } from '../../utils/read-net-guid';

export const readNetExportGuids = (replay: Replay, globalData: GlobalData) => {
  const numGuids = replay.readIntPacked();

  for (let i = 0; i < numGuids; i++) {
    const size = replay.readInt32();

    replay.addOffsetByte(2, size);

    readNetGuid(replay, true, globalData);

    replay.popOffset(2);
  }
};
