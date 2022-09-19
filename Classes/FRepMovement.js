const Replay = require("../src/Classes/Replay");

class FRepMovement {
  /**
   *
   * @param {Replay} reader
   */
  serialize(reader, globalData, { locationQuatLevel = 2, rotationQuatLevel = 0, velocityQuatLevel = 0 }) {
    this.bSimulatedPhysicSleep = reader.readBit();
    this.bRepPhysics = reader.readBit();

    if (globalData.header.EngineNetworkVersion >= 25 && globalData.header.EngineNetworkVersion !== 26) {
      this.bRepServerFrame = reader.readBit();
      this.bRepServerHandle = reader.readBit();
    }

    this.location = reader.readPackedVector(10 ** locationQuatLevel, 24 + (3 * locationQuatLevel));
    this.rotation = rotationQuatLevel ? reader.readRotationShort() : reader.readRotation();
    this.linearVelocity = reader.readPackedVector(10 ** velocityQuatLevel, 24 + (3 * velocityQuatLevel));

    if (this.bRepPhysics) {
      this.angularVelocity = reader.readPackedVector(10 ** velocityQuatLevel, 24 + (3 * velocityQuatLevel));
    }

    if (this.bRepServerFrame) {
      this.serverFrame = reader.readIntPacked();
    }

    if (this.bRepServerHandle) {
      this.serverHandle = reader.readIntPacked();
    }
  }
}

module.exports = FRepMovement;
