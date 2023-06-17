import GlobalData from '../src/Classes/GlobalData';
import { NetGuidCache } from '../src/Classes/NetGuidCache';
import Replay from '../src/Classes/Replay';
import EEngineNetworkCustomVersion from '../src/versions/EEngineNetworkCustomVersion';
import { CustomClass } from '../types/lib';

export class PlaylistInfo implements CustomClass {
  id: number;
  name: string;

  serialize(reader: Replay, globalData: GlobalData) {
    if (globalData.customVersion.getEngineNetworkVersion() >= EEngineNetworkCustomVersion.FastArrayDeltaStruct) {
      reader.readBit();
    }

    reader.readBit();
    this.id = reader.readIntPacked();
    reader.skipBits(31);
  }

  resolve(cache: NetGuidCache) {
    this.name = cache.tryGetPathName(this.id);
  }

  toJSON() {
    return this.name;
  }
}
