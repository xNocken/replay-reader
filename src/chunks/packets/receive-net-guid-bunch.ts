import { BaseResult } from '$types/lib';
import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';

import { readNetGuid } from '../../utils/read-net-guid';
import { readNetFieldExports } from './read-nfe-group';

export const receiveNetGUIDBunch = <ResultType extends BaseResult>(packet: Replay, globalData: GlobalData<ResultType>) => {
  const bHasRepLayoutExport = packet.readBit();

  if (bHasRepLayoutExport) {
    readNetFieldExports(packet, globalData, false);

    return;
  }

  const numGUIDsInBunch = packet.readInt32();
  const MAX_GUID_COUNT = 2048;

  if (numGUIDsInBunch > MAX_GUID_COUNT) {
    return;
  }

  for (let i = 0; i < numGUIDsInBunch; i += 1) {
    readNetGuid(packet, true, globalData);
  }
};
