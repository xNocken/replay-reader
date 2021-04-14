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
  serialize(reader, globalData, { locationQuatLevel = 2, rotationQuatLevel = 0, velocityQuatLevel = 0 }) {
    const flags = reader.readBits(2)[0];
    this.bSimulatedPhysicSleep = (flags & (1 << 0)) > 0;
    this.bRepPhysics = (flags & (1 << 1)) > 0;

    this.location = reader.readPackedVector(10 ** locationQuatLevel, 24 + (3 * locationQuatLevel));
    this.rotation = rotationQuatLevel ? reader.readRotation() : reader.readRotationShort();
    this.linearVelocity = reader.readPackedVector(10 ** velocityQuatLevel, 24 + (3 * velocityQuatLevel));

    if (this.bRepPhysics) {
      this.angularVelocity = reader.readPackedVector(10 ** velocityQuatLevel, 24 + (3 * velocityQuatLevel));
    }
  }
}

module.exports = FRepMovement;
