import { NetGuidCache } from '../src/Classes/NetGuidCache';
import Replay from '../src/Classes/Replay';

export class FGameplayTag {
  tagIndex: number;
  tagName: string;

  serialize(reader: Replay) {
    this.tagIndex = reader.readIntPacked();
  }

  resolve(cache: NetGuidCache) {
    this.tagName = cache.tryGetTagName(this.tagIndex);
  }

  toJSON() {
    return this.tagName || null;
  }
}
