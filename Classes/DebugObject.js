const Replay = require("../src/Classes/Replay");
const FGameplayTag = require("./FGameplayTag");
const FGameplayTagContainer = require("./FGameplayTagContainer");
const FName = require("./FName");
const FRepMovement = require("./FRepMovement");
const ItemDefinition = require("./ItemDefinition");

class DebugObject {
  /**
   * @type {Buffer}
   */
  data;
  name;

  constructor(data, exportt, bits, header) {
    if (!data || !exportt) {
      return;
    }

    this.data = data;
    this.name = exportt.name;
    this.size = bits;
    this.header = header;
  }

  /**
   * @param {Replay} reader
   */
  serialize(reader, globalData, config) {
    this.size = reader.getBitsLeft();
    this.data = reader.readBits(this.size);
    this.globalData = globalData;
    this.config = config;
    this.header = reader.header;
  }

  resolve(cache) {
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

    return this.data.toString('utf-8', 4, length);
  }

  getValueAsClass(Class) {
    const container = new Class();
    const replay = new Replay(this.data, this.size);

    replay.header = this.header;

    container.serialize(replay, this.globalData, this.config || {});

    if (replay.isError) {
      return null;
    }

    if (this.cache && container.resolve) {
      container.resolve(this.cache);
    }

    return container;
  }

  getValueAsFVector() {
    const replay = new Replay(this.data, this.size);

    replay.header = this.header;

    const vector = replay.readVector3d();

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

module.exports = DebugObject;
