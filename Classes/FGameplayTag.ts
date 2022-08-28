import { BaseResult, BaseStates } from '$types/lib';
import { NetGuidCache } from '../src/Classes/NetGuidCache';
import Replay from '../src/Classes/Replay';

export class FGameplayTag<ResultType extends BaseResult> {
  tagIndex: number;
  tagName: string;

  serialize(reader: Replay) {
    this.tagIndex = reader.readIntPacked();
  }

  resolve(cache: NetGuidCache<ResultType>) {
    this.tagName = cache.tryGetTagName(this.tagIndex);
  }

  toJSON() {
    return this.tagName || null;
  }
}
