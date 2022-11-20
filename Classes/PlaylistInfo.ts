import { NetGuidCache } from '../src/Classes/NetGuidCache';
import Replay from '../src/Classes/Replay';

export class PlaylistInfo {
  id: number;
  name: string;

  serialize(reader: Replay) {
    if (reader.header.engineNetworkVersion >= 11) {
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
