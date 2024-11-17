import { NetGuidCache } from '../src/Classes/NetGuidCache';
import Replay from '../src/Classes/Replay';
import EEngineNetworkCustomVersion from '../src/versions/EEngineNetworkCustomVersion';

export class FGameplayTag {
  tagIndex: number;
  tagName: string;

  serialize(reader: Replay) {
    let useFastReplication = false;
    let useDynamicReplication = false;

    if (reader.customVersion.getEngineNetworkVersion() >= EEngineNetworkCustomVersion.CustomExports) {
      useFastReplication = reader.readBit();

      if (!useFastReplication) {
        useDynamicReplication = reader.readBit();
      }
    }
    else {
      useFastReplication = true;
      useDynamicReplication = false;
    }

    if (useFastReplication) {
      this.tagIndex = reader.readIntPacked();
    }
    else if (useDynamicReplication) {
      this.tagIndex = reader.readIntPacked();

      if (this.tagIndex != 0) {
        reader.skipBits(1);
      }
    }
    else {
      this.tagName = reader.readString();
    }
  }

  resolve(cache: NetGuidCache) {
    if (this.tagIndex) {
      this.tagName = cache.tryGetTagName(this.tagIndex);
    }
  }

  toJSON() {
    return this.tagName || null;
  }
}
