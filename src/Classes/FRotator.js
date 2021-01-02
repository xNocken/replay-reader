class FRotator {
  pitch;
  yaw;
  roll;

  constructor(pitch, yaw, roll) {
    this.pitch = pitch;
    this.yaw = yaw;
    this.roll = roll;
  }

  toString() {
    return `Pitch: ${ this.pitch }, Yaw: ${ this.yaw }, Roll: ${ this.roll}`
  }
}

module.exports = FRotator;
