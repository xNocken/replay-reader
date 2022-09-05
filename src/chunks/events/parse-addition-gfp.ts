import { GFPEvent } from '../../../types/lib';
import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';

export const parseAdditionGFP = (globalData: GlobalData, replay: Replay, version: number) => {
  const count = replay.readUInt32();

  const values: GFPEvent[] = [];

  for (let i = 0; i < count; i += 1) {
    const moduleId = replay.readString();
    let moduleVersion;
    let artifactId;

    // TODO: check version 1

    if (version < 2) {
      moduleVersion = replay.readInt32();
    } else {
      artifactId = replay.readString();
    }

    values.push({
      moduleId,
      moduleVersion,
      artifactId,
    });
  }

  globalData.eventData.gfp = values;
};
