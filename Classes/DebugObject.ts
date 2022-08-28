import { BaseResult, BaseStates, CustomClass, Header } from '$types/lib';
import GlobalData from '../src/Classes/GlobalData';
import { NetGuidCache } from '../src/Classes/NetGuidCache';
import Replay from "../src/Classes/Replay";
import { FGameplayTag } from "./FGameplayTag";
import { FGameplayTagContainer } from "./FGameplayTagContainer";
import { FName } from "./FName";
import { FRepMovement } from "./FRepMovement";
import { ItemDefinition } from "./ItemDefinition";

export class DebugObject<ResultType extends BaseResult> {
  data: Buffer;
  name: string;
  size: number;
  header: Header;
  globalData: GlobalData<ResultType>;
  config: unknown;
  cache: NetGuidCache<ResultType>;

  serialize(reader: Replay, globalData: GlobalData<ResultType>, config: unknown) {
    this.size = reader.getBitsLeft();
    this.data = Buffer.from(reader.readBits(this.size));
    this.globalData = globalData;
    this.config = config;
    this.header = reader.header;
  }

  resolve(cache: NetGuidCache<ResultType>) {
    this.cache = cache;
  }

  getValueAsFloat() {
    if (this.data.length < 4) {
      return null;
    }

    return this.data.readFloatLE();
  }

  getValueAsInt() {
    if (this.data.length < 4) {
      return null;
    }
    return this.data.readInt32LE();
  }

  getValueAsBoolean() {
    if (this.data.length < 1) {
      return null;
    }
    return (this.data[0] & 1) === 1;
  }

  getValueAsString() {
    if (this.data.length < 4) {
      return null;
    }

    const length = this.data.readInt32LE();

    if (this.data.length < length + 4) {
      return null;
    }

    return this.data.toString('utf-8', 4, length + 3);
  }

  getValueAsClass(Class: new () => CustomClass<ResultType>) {
    const container = new Class();
    const replay = new Replay(this.data, this.size);

    replay.header = this.header;

    container.serialize(replay, this.globalData, this.config || {});

    if (replay.isError) {
      return null;
    }

    if (this.cache && container.resolve) {
      container.resolve(this.cache, this.globalData);
    }

    return container;
  }

  getValueAsFVector() {
    const replay = new Replay(this.data, this.size);

    const vector = replay.readVector();

    if (replay.isError) {
      return null;
    }

    return vector;
  }

  getValueAsIntPacked() {
    const replay = new Replay(this.data, this.size);

    const înt = replay.readIntPacked();

    if (replay.isError) {
      return null;
    }

    return înt;
  }

  toJSON() {
    return {
      size: this.size,
      float: this.getValueAsFloat(),
      int: this.getValueAsInt(),
      boolean: this.getValueAsBoolean(),
      string: this.getValueAsString(),
      fGameplayTagContainer: this.getValueAsClass(FGameplayTagContainer),
      fGameplayTag: this.getValueAsClass(FGameplayTag),
      itemDefinition: this.getValueAsClass(ItemDefinition),
      fRepMovement: this.getValueAsClass(FRepMovement),
      fName: this.getValueAsClass(FName),
      fVector: this.getValueAsFVector(),
      intPacked: this.getValueAsIntPacked(),
    };
  }
}
