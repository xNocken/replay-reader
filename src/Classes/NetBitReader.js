const Header = require('./header');

class NetBitReader {
  offset = 0;
  /**
   * @var {Header} header
   */
  header;
  info;

  constructor(input, bitCount) {
    /**
     * @var {Buffer} buffer
     */
    this.buffer = input;
    this.lastBit = bitCount || this.buffer * 8;
  }

  /**
   * Returns the but at current offset
   * @returns {number}
   */
  readBit() {
    const byteOffset = Math.floor(this.offset / 8);
    const bitOffset = this.offset % 8;

    const value = this.buffer[byteOffset] & (1 << bitOffset);

    this.offset += 1;

    return value;
  }

  readBits(count) {
    return Buffer.from(this.buffer.toString(2).slice(this.offset, this.offset + count), 'binary');
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
}

module.exports = NetBitReader;
