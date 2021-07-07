const crypto = require('crypto');
const unrealNames = require('./UnrealNames');
const Header = require('./Header');

class Replay {
  constructor(input, bitCount) {
    /**
     * @type {Buffer}
     */
    this.buffer = input;
    this.lastBit = bitCount || this.buffer.length * 8;
    /**
     * @type {number}
     */
    this.offset = 0;
    this.isError = false;
    this.offsets = [];

    /**
     * @type {Header}
     */
    this.header;
  }

  addOffset(offset) {
    if (!this.canRead(offset)) {
      throw Error('offset is larger than buffer');
    }

    this.offsets.push(this.lastBit);

    this.lastBit = this.offset + offset;
  }

  addOffsetByte(offset) {
    this.addOffset(offset * 8)
  }

  popOffset(numBits, ignoreError) {
    if (!this.offsets.length) {
      throw Error('no offsets available');
    }

    if (this.isError && !ignoreError) {
      throw Error(`Too much was read expected ${numBits}`);
    }

    this.isError = false;

    this.offset = this.lastBit;

    this.lastBit = this.offsets.pop();
  }

  getLastByte() {
    return this.buffer[(~~this.lastBit / 8) - 1];
  }

  /**
   * Returns the bit at current offset
   * @returns {boolean}
   */
  readBit() {
    if (this.atEnd() || this.isError) {
      this.isError = true;
      return false;
    }

    const byteOffset = ~~(this.offset / 8); // ~~ = math.trunc

    let value = this.buffer[byteOffset] >> (this.offset % 8) & 1;

    this.offset += 1;

    return value === 1;
  }

  readBits(count) {
    const buffer = Buffer.allocUnsafe(Math.ceil(count / 8));

    let byteOffset;
    let currentBit = 1;

    for (let i = 0; i < count; i++) {
      const bitOffset = i % 8;

      if (bitOffset === 0) {
        byteOffset = ~~(i / 8);
        currentBit = 1;
      }

      if (this.readBit()) {
        buffer[byteOffset] |= (currentBit);
      } else {
        buffer[byteOffset] &= ~(currentBit);
      }

      currentBit *= 2;
    }

    return buffer;
  }

  readBitsToInt(count) {
    let result = 0;
    let val = 1;

    for (let i = 0; i < count; i++) {
      if (this.readBit()) {
        result |= (val);
      }

      val *= 2;
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
    let remaining = true;
    let value = 0;
    let index = 0;

    while (remaining) {
      const currentByte = this.readByte();

      remaining = (currentByte & 1) === 1;

      value += (currentByte >> 1) << (7 * index);

      index += 1;
    }

    return value;
  }

  readBytes(byteCount) {
    if ((this.offset % 8) === 0) {
      const arr = Buffer.allocUnsafe(byteCount);
      const start = ~~(this.offset / 8);

      if (!this.canRead(byteCount)) {
        this.isError = true;

        return Buffer.from([]);
      }

      this.buffer.copy(arr, 0, start, start + byteCount);

      this.offset += byteCount * 8;

      return arr;
    } else {
      return this.readBits(byteCount * 8);
    }
  }

  readByte() {
    return this.readBytes(1)[0];
  }

  readInt16() {
    return this.readBytes(2).readInt16LE()
  }

  readUInt32() {
    return this.readBytes(4).readUInt32LE()
  }

  readInt32() {
    return this.readBytes(4).readInt32LE()
  }

  readUInt64() {
    return this.readBytes(8).readBigUInt64LE()
  }

  readString() {
    const length = this.readInt32();

    if (length === 0) {
      return '';
    }

    let value;

    if (length < 0) {
      if (!this.canRead(length * -2)) {
        this.isError = true;
        return '';
      }

      value = this.readBytes(length * -2).slice(0, -2).toString('utf16le').trim();
    } else {
      if (!this.canRead(length)) {
        this.isError = true;
        return '';
      }

      value = this.readBytes(length).slice(0, -1).toString('utf-8');
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
    this.skipBytes(4);

    return inString;
  }

  readFNameByte() {
    const isHardcoded = this.readByte();

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
    this.skipBytes(4);

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
    const newBuffer = Buffer.allocUnsafe(data.length + this.buffer.length);

    this.buffer.copy(newBuffer);
    data.copy(newBuffer, this.buffer.length);

    this.buffer = newBuffer;

    this.lastBit += bitCount;
  }

  readUInt16() {
    return this.readBytes(2).readUInt16LE(0);
  }

  atEnd() {
    return this.lastBit <= this.offset;
  }

  readFloat32() {
    if (!this.canRead(32)) {
      this.isError = true;

      return 0;
    }

    const hi = this.readBytes(4);
    const result = hi.readFloatLE(0);

    return result;
  }

  /**
   * Read an id
   * @returns {string} the id
   */
  readId() {
    return this.readBytes(16).toString('hex');
  }

  /**
   * Read an id
   * @returns {string} the id
   */
  readNetId() {
    const typeHashOther = 31;
    const encodingFlags = this.readByte();

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
        const encodedSize = this.readByte();

        return this.readBytes(encodedSize).toString('hex');
      }

      return this.readString();
    }

    return "";
  }

  /**
   * Read an array
   * @param {function} fn the function for all array elements
   * @returns {array} the array
   */
  readArray(fn) {
    const length = this.readUInt32();
    const returnArray = [];

    for (let i = 0; i < length; i += 1) {
      returnArray.push(fn(this));
    }

    return returnArray;
  }

  /**
   * Read an array that consists of objects
   * @param {function} fn1 the function for all array keys
   * @param {function} fn2 the function for all array values
   * @returns {array<object>} the array
   */
  readObjectArray(fn1, fn2) {
    const length = this.readUInt32();
    const returnArray = [];

    for (let i = 0; i < length; i += 1) {
      const obj = {};
      obj[fn1(this)] = fn2(this);
      returnArray.push(obj);
    }

    return returnArray;
  }


  readVector() {
    return { x: this.readFloat32(), y: this.readFloat32(), z: this.readFloat32() };
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
      return { x: 0, y: 0, z: 0 };
    }

    const bias = 1 << (bits + 1);
    const max = 1 << (bits + 2);

    const dx = this.readSerializedInt(max);
    const dy = this.readSerializedInt(max);
    const dz = this.readSerializedInt(max);

    if (this.isError) {
      return { x: 0, y: 0, z: 0 };
    }

    const x = (dx - bias) / scaleFactor;
    const y = (dy - bias) / scaleFactor;
    const z = (dz - bias) / scaleFactor;

    return { x, y, z };
  }

  /**
   * Decrypt a buffer
   * @param {number} length buffer length
   * @returns {Replay} decrypted buffer
   */
  decryptBuffer(length) {
    if (!this.info.IsEncrypted) {
      this.addOffsetByte(length);

      return this;
    };

    const bytes = this.readBytes(length);

    const decipher = crypto.createDecipheriv('aes-256-ecb', this.info.EncryptionKey, null);
    const newBuffer = Buffer.from(decipher.update(bytes, 'binary', 'binary') + decipher.final('binary'), 'binary');

    const newReplay = new Replay(newBuffer);

    newReplay.header = this.header;
    newReplay.info = this.info;
    newReplay.playerList = this.playerList;

    return newReplay;
  }

  readRotation() {
    let pitch = 0;
    let yaw = 0;
    let roll = 0;

    if (this.readBit()) {
      pitch = this.readByte() * 360 / 256;
    }

    if (this.readBit()) {
      yaw = this.readByte() * 360 / 256;
    }

    if (this.readBit()) {
      roll = this.readByte() * 360 / 256;
    }

    if (this.isError) {
      return { pitch: 0, yaw: 0, roll: 0 };
    }

    return { pitch, yaw, roll };
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
      return { pitch: 0, yaw: 0, roll: 0 };
    }

    return { pitch, yaw, roll };
  }

  skipBits(bits) {
    this.offset += bits;
  }

  skipBytes(bits) {
    this.offset += bits * 8;
  }

  getByteOffset() {
    return this.offset / 8;
  }

  goToByte(offset) {
    this.offset = offset * 8;
  }

  /**
   * Checks the flag for HasStreamingFixes
   * @returns {Boolean}
   */
  hasLevelStreamingFixes() {
    return (this.header.Flags & 2) === 2;
  }

  /**
   * Checks the flag for GameSpecificFrameData
   * @returns {Boolean}
   */
  hasGameSpecificFrameData() {
    return (this.header.Flags & 8) === 8;
  }
}

module.exports = Replay;
