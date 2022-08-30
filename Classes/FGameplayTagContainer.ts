import { BaseResult, BaseStates } from '$types/lib';
import { NetGuidCache } from '../src/Classes/NetGuidCache';
import Replay from '../src/Classes/Replay';
import { FGameplayTag } from "./FGameplayTag";

export class FGameplayTagContainer {
  tags: FGameplayTag[];

  constructor() {
    this.tags = [];
  }

  serialize(reader: Replay) {
    if (reader.readBit()) {
      return;
    }

    const numTags = reader.readBitsToUnsignedInt(7);

    for (let i = 0; i < numTags; i++) {
      this.tags[i] = new FGameplayTag();

      this.tags[i].serialize(reader);
    }
  }

  resolve(cache: NetGuidCache) {
    if (!this.tags.length) {
      return;
    }

    this.tags.forEach((tag) => {
      tag.resolve(cache);
    });
  }

  toJSON() {
    return this.tags || null;
  }
}
