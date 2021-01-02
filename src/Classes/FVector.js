class FVector {
  /**
   * @type {number}
   */
  x;

  /**
   * @type {number}
   */
  y;

  /**
   * @type {number}
   */
  z;

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
