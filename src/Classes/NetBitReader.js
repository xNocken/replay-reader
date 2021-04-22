const unrealNames = require('../../Classes/UnrealNames');
const FRotator = require('./FRotator');
const FVector = require('./FVector');
const Header = require('./Header');

class NetBitReader {
  /**
   * @type {number}
   */
  offset;
  /**
   * @type {Header}
   */
  header;
  info;
  isError;

  constructor(input, bitCount) {
    /**
     * @type {Buffer}
     */
    this.buffer = input;
    this.lastBit = bitCount || this.buffer.length * 8;
    this.offset = 0;
    this.isError = false;
  }

  /**
   * Returns the but at current offset
   * @returns {number}
   */
  readBit() {
    if (this.atEnd() || this.isError) {
      this.isError = true;
      return false;
    }

    const byteOffset = ~~(this.offset / 8); // ~~ = math.floor

    let value = this.buffer[byteOffset] >> (this.offset % 8) & 1;

    this.offset += 1;

    return value;
  }

  readBits(count) {
    const buffer = Buffer.from({ length: Math.ceil(count / 8) });

    let byteOffset;

    for (let i = 0; i < count; i++) {
      const bitOffset = i % 8;

      if (bitOffset == 0) {
        byteOffset = ~~(i / 8);
      }

      if (this.readBit()) {
        buffer[byteOffset] |= (1 << bitOffset);
      }
    }

    return buffer;
  }

  readBitsToInt(count) {
    let result = 0;

    for (let i = 0; i < count; i++) {
      if (this.readBit()) {
        result |= (1 << i);
      }
    }

    return result;
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
    let srcIndex = ~~(this.offset / 8); // ~~ = math.floor
    let nextSrcIndex = bitCountUsedInByte != 0 ? srcIndex + 1 : srcIndex;

    let value = 0;

    for (let It = 0, shiftCount = 0; It < 5; It++, shiftCount += 7) {
      if (!this.canRead(8)) {
        break;
      }

      if (nextSrcIndex >= this.buffer.length) {
        nextSrcIndex = srcIndex;
      }

      this.offset += 8;

      const readByte = (((this.buffer[srcIndex] >> bitCountUsedInByte) & srcMaskByte0) | ((this.buffer[nextSrcIndex] & srcMaskByte1) << (bitCountLeftInByte & 7)));
      value = ((readByte >> 1) << shiftCount) | value;
      srcIndex++;
      nextSrcIndex++;

      if ((readByte & 1) == 0) {
        break;
      }
    }

    return value;
  }

  readBytes(byteCount) {
    const arr = [];

    if ((this.offset % 8) === 0) {
      while (byteCount) {
        arr.push(this.buffer[this.offset / 8]);
        byteCount -= 1;
        this.offset += 8;
      }

      return Buffer.from(arr);
    } else {
      return this.readBits(byteCount * 8);
    }
  }

  readByte() {
    return this.readBytes(1);
  }

  readInt8() {
    return this.readBytes(1)[0]
  }

  readInt16() {
    return Buffer.from(this.readBytes(2)).readInt16LE()
  }

  readUInt32() {
    return Buffer.from(this.readBytes(4)).readUInt32LE()
  }

  readInt32() {
    return Buffer.from(this.readBytes(4)).readInt32LE()
  }

  readUInt64() {
    return Buffer.from(this.readBytes(8)).readBigUInt64LE()
  }

  readString() {
    const length = this.readInt32();

    if (!this.canRead(length)) {
      this.isError = true;
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

      return unrealNames[nameIndex];
    }

    const inString = this.readString();
    const inNumber = this.readInt32();

    return inString;
  }

  readBoolean() {
    return this.readInt32() === 1;
  }

  getBitsLeft() {
    return this.lastBit - this.offset;
  }

  /**
   *
   * @param {Buffer} data
   * @param {number} bitCount
   */
  appendDataFromChecked(data, bitCount) {
    const newBuffer = Buffer.from({ length: data.length + this.buffer.length });

    this.buffer.copy(newBuffer);
    data.copy(newBuffer, this.buffer.length);

    this.buffer = newBuffer;

    this.lastBit += bitCount;
  }

  readUInt16() {
    return Buffer.from(this.readBytes(2)).readUInt16LE(0);
  }

  atEnd() {
    return this.lastBit <= this.offset;
  }

  readFloat32() {
    const hi = this.readBytes(4);
    const result = Buffer.from(hi).readFloatLE(0);
    return result;
  }

  /**
   * Read an id
   * @returns {string} the id
   */
  readId() {
    return Buffer.from(this.readBytes(16)).toString('hex');
  }

  /**
   * Read an id
   * @returns {string} the id
   */
  readNetId() {
    const typeHashOther = 31;
    const encodingFlags = this.readByte()[0];

    let encoded = false;

    if ((encodingFlags & 1) === 1) {
      encoded = true;

      if ((encodingFlags & 2) === 2) {
        return "";
      }
    }

    const typeHash = encodingFlags & 248;

    if (typeHash == 0) {
      return 'NULL';
    }

    let bValidHashType = typeHash != 0;
    let typeString = '';

    if (typeHash === typeHashOther) {
      typeString = this.readString();

      if (typeString === 'None') {
        bValidHashType = false;
      }
    }

    if (bValidHashType) {
      if (encoded) {
        const encodedSize = this.readByte()[0];

        return Buffer.from(this.readBytes(encodedSize)).toString('hex');
      }

      return this.readString();
    }

    return "";
  }


  readVector() {
    return new FVector(this.readFloat32(), this.readFloat32(), this.readFloat32());
  }

  readPackedVector100() {
    return this.readPackedVector(100, 30);
  }

  readPackedVector10() {
    return this.readPackedVector(10, 24);
  }

  readPackedVector1() {
    return this.readPackedVector(1, 24);
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

  readRotation() {
    let pitch = 0;
    let yaw = 0;
    let roll = 0;

    if (this.readBit()) {
      pitch = this.readByte()[0] * 360 / 256;
    }

    if (this.readBit()) {
      yaw = this.readByte()[0] * 360 / 256;
    }

    if (this.readBit()) {
      roll = this.readByte()[0] * 360 / 256;
    }

    if (this.isError) {
      return new FRotator(0, 0, 0);
    }

    return new FRotator(pitch, yaw, roll);
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

  skipBits(bits) {
    this.offset += bits;
  }
}

module.exports = NetBitReader;
