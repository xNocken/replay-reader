import { ExternalData } from "../../../types/lib";
import GlobalData from "../../Classes/GlobalData";
import Replay from "../../Classes/Replay";

export const readExternalData = (replay: Replay, globalData: GlobalData) => {
  while (true) {
    const externalDataNumBits = replay.readIntPacked();

    if (!externalDataNumBits) {
      return;
    }

    const netGuid = replay.readIntPacked();
    const externalDataNumBytes = (externalDataNumBits + 7) >> 3;

    const handle = replay.readByte();
    const something = replay.readByte();
    const isEncrypted = replay.readByte();

    const externalData: ExternalData = {
      netGuid,
      externalDataNumBits,
      handle,
      something,
      isEncrypted,
      payload: replay.readBytes(externalDataNumBytes - 3),
    };

    globalData.externalData[netGuid] = externalData;
  }
};
