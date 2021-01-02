const FRotator = require('./FRotator');
const FVector = require('./FVector');
const Header = require('./header');

class NetBitReader {
  /**
   * @type {number}
   */
  offset = 0;
  /**
   * @type {Header}
   */
  header;
  info;
  isError = false;

  constructor(input, bitCount) {
    /**
     * @type {Buffer}
     */
    this.buffer = input;
    this.lastBit = bitCount || this.buffer * 8;
  }

  /**
   * Returns the but at current offset
   * @returns {number}
   */
  readBit() {
    if (this.atEnd() ||this.isError) {
      this.isError = true;
      return false;
    }

    const value = this.buffer.toString('binary')[this.offset];

    this.offset += 1;

    return value;
  }

  readBits(count) {
    return Buffer.from(this.buffer.toString('binary').slice(this.offset, this.offset + count), 'binary');
  }

  /**
   * Return the next bits from the array thats smaller than maxValue
   * @param {number} maxValue
   *
   * @returns {number}
   */
  readSerializedInt(maxValue) {
    let value = 0;

    for (let mask = 1; (value + mask) < maxValue; mask *= 2) {
      if (this.readBit()) {
        value |= mask;
      }
    }

    return value;
  }

  canRead(number) {
    return number + this.offset <= this.lastBit;
  }

  readIntPacked() {
    let bitCountUsedInByte = this.offset % 8;
    let bitCountLeftInByte = 8 - (this.offset % 8);
    let srcMaskByte0 = ((1 << bitCountLeftInByte) - 1);
    let srcMaskByte1 = ((1 << bitCountUsedInByte) - 1);
    let srcIndex = this.offset;
    let nextSrcIndex = bitCountUsedInByte != 0 ? srcIndex + 1 : srcIndex;

    let value;

    for (let It = 0, shiftCount = 0; It < 5; It++, shiftCount += 7) {
      if (!this.canRead(8)) {
        break;
      }

      if (nextSrcIndex >= this.buffer.length) {
        nextSrcIndex = srcIndex;
      }

      this.offset += 8;

      const readByte = (((this.buffer[srcIndex] >> bitCountUsedInByte) & srcMaskByte0) | ((this.buffer[nextSrcIndex] & srcMaskByte1) << (bitCountLeftInByte) & 7));
      value = ((readByte >> 1) << shiftCount) | value;
      srcIndex++;
      nextSrcIndex++;

      if ((readByte & 1) == 0) {
        break;
      }
    }
  }

  readBytes(byteCount) {
    if (!this.canRead(byteCount * 8) || byteCount < 0) {
      return [];
    }

    let bitCountUsedInByte = this.offset % 8;
    let bitCountLeftInByte = 8 - (this.offset % 8);
    const result = [];
    const byteOffset = Math.floor(this.offset / 8);

    if (bitCountUsedInByte === 0) {
      result = this.buffer.slice(byteCount, byteOffset + byteCount)
    } else {
      const output = [];

      for (let i = 0; i < byteCount; i++) {
        output[i] = ((this.buffer[byteOffset + i] >> bitCountUsedInByte) | ((this.buffer[byteOffset + i] & ((1 << bitCountUsedInByte) - 1)) << bitCountLeftInByte))
      }

      result = output;
    }

    this.position += byteCount * 8;
  }

  readByte() {
    return this.readBytes(1);
  }

  readUInt32() {
    return Buffer.from(this.readBytes(4)).readUInt32LE()
  }

  readInt32() {
    return Buffer.from(this.readBytes(4)).readInt32LE()
  }

  readString() {
    const length = this.readInt32();

    if (!this.canRead(length)) {
      return '';
    }

    if (length === 0) {
      return '';
    }

    let value;

    if (length < 0) {
      value = Buffer.from(this.readBytes(length * -2)).slice(0, -2).toString('utf16le').trim();
    } else {
      value = Buffer.from(this.readBytes(length)).slice(0, -1).toString('utf-8');
    }

    return value;
  }

  readFName() {
    const isHardcoded = this.readBit();

    if (isHardcoded) {
      let nameIndex;

      if (this.header.EngineNetworkVersion < 6) {
        nameIndex = this.readUInt32();
      } else {
        nameIndex = this.readIntPacked();
      }

      return nameIndex.toString();
    }

    const inString = this.readString();
    const inNumber = this.readInt32();

    return inString;
  }

  readBoolean() {
    return this.readInt32() === 1;
  }

  getBitsLeft() {
    return this.lastBit - this.offset + 1;
  }

  appendDataFromChecked(data, bitCount) {
    this.buffer = Buffer.from(this.buffer.toString(2) + data.toString(2), 'binary');
  }

  readUInt16() {
    return Buffer.from(this.readBytes(2)).readUInt16LE(0);
  }

  atEnd() {
    return this.lastBit <= this.offset;
  }

  readFloat32() {
    return Buffer.from(this.readBytes(4)).readFloatLE(0);
  }

  readVector() {
    return new FVector(this.readFloat32(), this.readFloat32(), this.readFloat32());
  }

  readPackedVector(scaleFactor, maxBits) {
    const bits = this.readSerializedInt(maxBits);

    if (this.isError) {
      return new FVector(0, 0, 0);
    }

    const bias = 1 << (bits + 1);
    const max = 1 << (bits + 2);

    const dx = this.readSerializedInt(max);
    const dy = this.readSerializedInt(max);
    const dz = this.readSerializedInt(max);

    if (this.isError) {
      return new FVector(0, 0, 0);
    }

    const x = (dx - bias) / scaleFactor;
    const y = (dy - bias) / scaleFactor;
    const z = (dz - bias) / scaleFactor;

    return new FVector(x, y, z);
  }

  readRotationShort() {
    let pitch = 0;
    let yaw = 0;
    let roll = 0;

    if (this.readBit()) {
      pitch = this.readUInt16() * 360 / 65536;
    }

    if (this.readBit()) {
      yaw = this.readUInt16() * 360 / 65536;
    }

    if (this.readBit()) {
      roll = this.readUInt16() * 360 / 65536;
    }

    if (this.isError) {
      return new FRotator(0, 0, 0);
    }

    return new FRotator(pitch, yaw, roll);
  }
}

module.exports = NetBitReader;
