class DebugObject {
  /**
   * @type {Buffer}
   */
  data;
  name;

  constructor(data, exportt) {
    this.data = data;
    this.name = exportt.name;
  }

  getValueAsFloat() {
    return this.data.readFloatLE();
  }

  getValueAsInt() {
    return this.data.readInt32LE();
  }

  getValueAsBoolean() {
    return this.data[0] & 1;
  }
}

module.exports = DebugObject;
