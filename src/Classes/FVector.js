class FVector {
  constructor (x, y, z) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  toString() {
    return `X: ${this.x}, Y: ${this.y}, Z: ${this.z}`;
  }
}

module.exports = FVector;
