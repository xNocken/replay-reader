class FRepMovement {
  serialize(reader, globalData, { locationQuatLevel = 2, rotationQuatLevel = 0, velocityQuatLevel = 0 }) {
    this.bSimulatedPhysicSleep = reader.readBit();
    this.bRepPhysics = reader.readBit();

    this.location = reader.readPackedVector(10 ** locationQuatLevel, 24 + (3 * locationQuatLevel));
    this.rotation = rotationQuatLevel ? reader.readRotationShort() : reader.readRotation();
    this.linearVelocity = reader.readPackedVector(10 ** velocityQuatLevel, 24 + (3 * velocityQuatLevel));

    if (this.bRepPhysics) {
      this.angularVelocity = reader.readPackedVector(10 ** velocityQuatLevel, 24 + (3 * velocityQuatLevel));
    }
  }
}

module.exports = FRepMovement;
