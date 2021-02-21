// TODO

const NetBitReader = require("../src/Classes/NetBitReader");

class FRepMovement {
  linearVelocity;
  angularVelocity;
  location;
  rotation;
  bSimulatedPhysicSleep;
  bRepPhysics;

  /**
   *
   * @param {NetBitReader} reader
   */
  serialize(reader) {
    const flags = reader.readBits(2);
    this.bSimulatedPhysicSleep = (flags & (1 << 0)) > 0;
    this.bRepPhysics = (flags & (1 << 1)) > 0;

    // TODO: decide by QuantizationLevels

    this.location = reader.readPackedVector10();
    this.rotation = reader.readRotationShort();
    this.linearVelocity = reader.readPackedVector10();

    if (this.bRepPhysics) {
      this.angularVelocity = reader.readPackedVector10();
    }
  }
}

module.exports = FRepMovement;
