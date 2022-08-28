import { BaseResult, BaseStates } from '$types/lib';
import { NetGuidCache } from '../src/Classes/NetGuidCache';
import { NetworkGUID } from "./NetworkGUID";

export class ItemDefinition<ResultType extends BaseResult> extends NetworkGUID {
  name: string;

  resolve(cache: NetGuidCache<ResultType>) {
    if (this.isValid()) {
      const name = cache.tryGetPathName(this.value);

      if (name) {
        this.name = name;
      }
    }
  }

  toJSON() {
    return this.name || null;
  }
}
