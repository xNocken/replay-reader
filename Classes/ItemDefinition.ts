import { NetGuidCache } from '../src/Classes/NetGuidCache';
import { NetworkGUID } from "./NetworkGUID";

export class ItemDefinition extends NetworkGUID {
  name: string;

  resolve(cache: NetGuidCache) {
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
