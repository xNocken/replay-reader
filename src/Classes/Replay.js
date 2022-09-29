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

  addOffset(index, offset) {
    if (!this.canRead(offset)) {
      throw Error('offset is larger than buffer');
    }

    this.offsets[index] = this.lastBit;

    this.lastBit = this.offset + offset;
  }

  addOffsetByte(index, offset) {
    this.addOffset(index, offset * 8)
  }

  popOffset(index, numBits, ignoreError) {
    if (this.isError && !ignoreError) {
      throw Error(`Too much was read expected ${numBits}`);
    }

    this.isError = false;

    this.offset = this.lastBit;

    this.lastBit = this.offsets[index];

    this.offsets.splice(index, this.offsets.length);
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

    let value = this.buffer[byteOffset] >> (this.offset & 7) & 1;

    this.offset += 1;

    return value === 1;
  }

  readBits(count) {
    const buffer = Buffer.allocUnsafe(Math.ceil(count / 8));
    let readBytes = 0;

    if ((this.offset & 7) === 0) {
      readBytes = ~~(count / 8);
      const bytes = this.readBytes(readBytes);

      bytes.copy(buffer);
    }

    let currentBit;
    let currentResultOffset;
    let currentByte = this.buffer[~~(this.offset / 8)];
    let currentByteBit = 1 << (this.offset & 7);

    for (let i = readBytes * 8; i < count; i++) {
      const bitOffset = this.offset & 7;
      const resultBitOffset = i & 7;

      if (resultBitOffset === 0) {
        currentResultOffset = i / 8;
        currentBit = 1;
      }

      if (bitOffset === 0) {
        currentByteBit = 1;
        currentByte = this.buffer[~~(this.offset / 8)];
      }

      if (currentByte & currentByteBit) {
        buffer[currentResultOffset] |= (currentBit);
      } else {
        buffer[currentResultOffset] &= ~(currentBit);
      }

      this.offset += 1;

      currentByteBit *= 2;
      currentBit *= 2;
    }

    return buffer;
  }

  readBitsToInt(count) {
    const maxVal = count === 32 ? 2147483648 : 1 << (count - 1);
    let val = 0;
    let readBits = 0;

    if ((this.offset & 7) === 0) {
      let bytesToRead = ~~((count - 1) / 8)

      for (let i = 0; i < bytesToRead; i++) {
        val |= this.buffer[this.offset / 8] << (readBits);

        readBits += 8;
        this.offset += 8;
      }

      if (count === 0) {
        return val;
      }
    }

    let currentBit = 1 << readBits;
    let currentByte = this.buffer[~~(this.offset / 8)];
    let currentByteBit = 1 << (this.offset & 7);

    for (let i = readBits; i < count; i++) {
      const bitOffset = this.offset & 7;

      if (bitOffset === 0) {
        currentByteBit = 1;
        currentByte = this.buffer[~~(this.offset / 8)];
      }

      if (i === count - 1) {
        if (currentByte & currentByteBit) {
          val = -(maxVal - val);
        }

        this.offset += 1;
        break;
      }

      if (currentByte & currentByteBit) {
        val |= (currentBit);
      }

      this.offset += 1;

      currentByteBit *= 2;
      currentBit *= 2;
    }

    return val;
  }

  readBitsToUnsignedInt(count) {
    let val = 0;
    let readBits = 0;

    if ((this.offset & 7) === 0) {
      let index = 0;

      while (count >= 8) {
        val |= this.buffer[this.offset / 8] << (index * 8);

        index += 1;
        count -= 8;
        readBits += 8;
        this.offset += 8;
      }

      if (count === 0) {
        return val >>> 0;
      }
    }

    let currentBit = (1 << readBits);
    let currentByte = this.buffer[~~(this.offset / 8)];
    let currentByteBit = 1 << (this.offset & 7);

    for (let i = 0; i < count; i++) {
      const bitOffset = this.offset & 7;

      if (bitOffset === 0) {
        currentByteBit = 1;
        currentByte = this.buffer[~~(this.offset / 8)];
      }

      if (currentByte & currentByteBit) {
        val |= (currentBit);
      }

      this.offset += 1;

      currentByteBit *= 2;
      currentBit *= 2;
    }

    return val >>> 0;
  }

  /**
   * Return the next bits from the array thats smaller than maxValue
   * @param {number} maxValue
   *
   * @returns {number}
   */
  readSerializedInt(maxValue) {
    let value = 0;

    let currentByte = this.buffer[~~(this.offset / 8)];
    let currentByteBit = 1 << (this.offset & 7);

    for (let mask = 1; (value + mask) < maxValue; mask *= 2) {
      const bitOffset = this.offset & 7;

      if (bitOffset === 0) {
        currentByteBit = 1;
        currentByte = this.buffer[~~(this.offset / 8)];
      }

      if (currentByte & currentByteBit) {
        value |= mask;
      }

      this.offset += 1;

      currentByteBit *= 2;
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
    if ((this.offset & 7) === 0) {
      const start = ~~(this.offset / 8);

      if (!this.canRead(byteCount)) {
        this.isError = true;

        return Buffer.from([]);
      }

      const arr = this.buffer.slice(start, start + byteCount);

      this.offset += byteCount * 8;

      return arr;
    } else {
      const result = Buffer.allocUnsafe(byteCount);

      for (let i = 0; i < byteCount; i++) {
        result[i] = this.readByte();
      }

      return result;
    }
  }

  readByte() {
    return this.readBitsToUnsignedInt(8);
  }

  readInt16() {
    return this.readBytes(2).readInt16LE();
  }

  readUInt16() {
    return this.readBitsToUnsignedInt(16);
  }

  readUInt32() {
    return this.readBitsToUnsignedInt(32);
  }

  readInt32() {
    return this.readBytes(4).readInt32LE();
  }

  readUInt64() {
    return this.readBytes(8).readBigUInt64LE()
  }

  readString() {
    const length = this.readInt32();

    if (length === 0) {
      return '';
    }

    if (length < 0) {
      if (!this.canRead(length * -2)) {
        this.isError = true;
        return '';
      }

      return this.readBytes(length * -2).slice(0, -2).toString('utf16le').trim();
    } else {
      if (!this.canRead(length)) {
        this.isError = true;
        return '';
      }

      return this.readBytes(length).slice(0, -1).toString('utf-8');
    }
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
    const val = this.readBit();

    this.offset += 31;

    return val;
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

  atEnd() {
    return this.lastBit <= this.offset;
  }

  readFloat32() {
    if (!this.canRead(32)) {
      this.isError = true;

      return 0;
    }

    const result = this.readBytes(4).readFloatLE(0);

    return result;
  }

  readDouble64() {
    if (!this.canRead(64)) {
      this.isError = true;

      return 0;
    }

    const result = this.readBytes(8).readDoubleLE(0);

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
    const obj = {};

    for (let i = 0; i < length; i += 1) {
      obj[fn1(this)] = fn2(this);
    }

    return obj;
  }


  readVector3f() {
    return {
      x: this.readFloat32(),
      y: this.readFloat32(),
      z: this.readFloat32(),
    };
  }

  readVector4f() {
    return {
      x: this.readFloat32(),
      y: this.readFloat32(),
      z: this.readFloat32(),
      w: this.readFloat32(),
    };
  }

  readVector3d() {
    if (this.header.EngineNetworkVersion < 23) {
      return this.readVector3f();
    }

    return {
      x: this.readDouble64(),
      y: this.readDouble64(),
      z: this.readDouble64(),
    };
  }

  readVector4d() {
    if (this.header.EngineNetworkVersion < 23) {
      return this.readVector4f();
    }

    return {
      x: this.readDouble64(),
      y: this.readDouble64(),
      z: this.readDouble64(),
      w: this.readDouble64(),
    };
  }

  /**
   * @deprecated
   */
  readVector() {
    return this.readVector3d();
  }

  readPackedVector100() {
    return this.readPackedVector(100, 30);
  }

  readPackedVector10() {
    return this.readPackedVector(10, 27);
  }

  readPackedVector1() {
    return this.readPackedVector(1, 24);
  }

  readQuantizedVector(scaleFactor) {
    const bitsAndInfo = this.readSerializedInt(1 << 7);

    if (this.isError) {
      return { x: 0, y: 0, z: 0 };
    }

    const componentBits = bitsAndInfo & 63;
    const extraInfo = bitsAndInfo >> 6;

    if (componentBits > 0) {
      const x = this.readBitsToUnsignedInt(componentBits);
      const y = this.readBitsToUnsignedInt(componentBits);
      const z = this.readBitsToUnsignedInt(componentBits);

      const signBit = 1 << (componentBits - 1);

      const xSign = (x ^ signBit) - signBit;
      const ySign = (y ^ signBit) - signBit;
      const zSign = (z ^ signBit) - signBit;

      if (extraInfo) {
        return {
          x: xSign / scaleFactor,
          y: ySign / scaleFactor,
          z: zSign / scaleFactor,
        };
      }

      return {
        x: xSign,
        y: ySign,
        z: zSign,
      };
    }

    const size = extraInfo ? 8 : 4;

    if (size === 8) {
      return {
        x: this.readDouble64(),
        y: this.readDouble64(),
        z: this.readDouble64(),
      };
    }

    return {
      x: this.readFloat32(),
      y: this.readFloat32(),
      z: this.readFloat32(),
    };
  }

  readPackedVectorLegacy(scaleFactor, maxBits) {
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

  readPackedVector(scaleFactor, maxBits) {
    if (this.header.EngineNetworkVersion >= 23) {
      return this.readQuantizedVector(scaleFactor);
    }

    return this.readPackedVectorLegacy(scaleFactor, maxBits);
  }

  /**
   * Decrypt a buffer
   * @param {number} length buffer length
   * @returns {Replay} decrypted buffer
   */
  decryptBuffer(length) {
    if (!this.info.IsEncrypted) {
      this.addOffsetByte(1, length);

      return this;
    };

    const bytes = this.readBytes(length);

    const decipher = crypto.createDecipheriv('aes-256-ecb', this.info.EncryptionKey, null);
    const newBuffer = Buffer.from(decipher.update(bytes, 'binary', 'binary') + decipher.final('binary'), 'binary');

    const newReplay = new Replay(newBuffer);

    newReplay.header = this.header;
    newReplay.info = this.info;

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

  goTo(offset) {
    this.offset = offset;
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
   * Checks the flag for HasDeltaCheckpoints
   * @returns {Boolean}
   */
  hasDeltaCheckpoints() {
    return (this.header.Flags & 4) === 4;
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
