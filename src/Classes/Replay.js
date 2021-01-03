const crypto = require('crypto');
const Header = require('./Header');
const Info = require('./Info');
const Player = require('./Player');

/**
 * A binary parser
 *
 * @author https://github.com/ThisNils
 */
class Replay {
  /**
   * @param {Buffer} buffer the binary buffer
   */
  constructor(buffer) {
    /**
     * The buffer
     * @type {Buffer}
     */
    if (buffer) {
      this.buffer = Buffer.from(buffer);
    }

    /**
     * Current byte offset
     * @type {number}
     */
    this.offset = 0;

    /**
     * Header informations about the replay
     * @type {Header}
     */
    this.header = null;

    /**
     * Informations about the replay
     * @type {Info}
     */
    this.info = null;

    /**
     * If the replay is compressed
     * @type {Boolean}
     */
    this.isCompressed = false;

    /**
     * A list of all players
     * @type {Array<Player>}
     */
    this.playerList = [];
  }

  /**
   * Skip bytes
   * @param {number} count bytes to skip
   */
  skip(count) {
    this.offset += count;
  }

  /**
   * Go to a buffer offset
   * @param {number} offset new offset
   */
  goto(offset) {
    this.offset = offset;
  }

  /**
   * Read a uint16
   * @returns {number} the int
   */
  readUInt16() {
    const int = this.buffer.readUInt16LE(this.offset);
    this.offset += 2;
    return int;
  }

  /**
   * Read a intpacked
   * @returns {number} the int
   */
  readIntPacked() {
    let value = 0;
    let count = 0;
    let remaining = true;

    while (remaining) {
      let nextByte = this.readByte()[0];
      remaining = (nextByte & 1) === 1;
      nextByte >>= 1;
      value += nextByte << (7 * count++);
    }

    return value;
  }

  /**
   * Read a int32
   * @returns {number} the int
   */
  readInt32() {
    const int = this.buffer.readInt32LE(this.offset);
    this.offset += 4;
    return int;
  }

  /**
   * Read a int32
   * @returns {number} the int
   */
  readUInt32() {
    const int = this.buffer.readUInt32LE(this.offset);
    this.offset += 4;
    return int;
  }

  /**
   * Read a float32
   * @returns {number} the float
   */
  readFloat32() {
    const float = this.buffer.readFloatLE(this.offset);
    this.offset += 4;
    return float;
  }

  /**
   * Read a uint64
   * @returns {bigint} the int
   */
  readUInt64() {
    const int = this.buffer.readBigUInt64LE(this.offset);
    this.offset += 8;
    return int;
  }

  /**
   * Read a byte
   * @returns {Buffer} the byte
   */
  readByte() {
    const byte = Buffer.from(this.buffer.toString('binary', this.offset, this.offset + 1), 'binary');
    this.offset += 1;
    return byte;
  }

  /**
   * Read multiple bytes
   * @returns {Buffer} the bytes
   */
  readBytes(count) {
    const bytes = Buffer.from(this.buffer.toString('binary', this.offset, this.offset + count), 'binary');
    this.offset += count;
    return bytes;
  }

  /**
   * Read a boolean
   * @returns {boolean} the boolean
   */
  readBool() {
    return this.readInt32() === 1;
  }

  /**
   * Read an id
   * @returns {string} the id
   */
  readId() {
    return this.readBytes(16).toString('hex');
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

  /**
   * Read a string
   * @returns {string} the string
   */
  readString() {
    const length = this.readInt32();
    if (length === 0) return '';
    if (length < 0) return this.readBytes(length * -2).slice(0, -2).toString('utf16le').trim();

    const str = this.readBytes(length).slice(0, -1);

    return str.toString('utf-8');
  }

  /**
   * Decrypt a buffer
   * @param {number} length buffer length
   * @returns {Replay} decrypted buffer
   */
  decryptBuffer(length) {
    const bytes = this.readBytes(length);
    let newBuffer = new Replay();

    newBuffer.header = this.header;
    newBuffer.info = this.info;
    newBuffer.playerList = this.playerList;

    if (!this.info.IsEncrypted) {
      newBuffer.buffer = bytes;
      return newBuffer;
    };

    const decipher = crypto.createDecipheriv('aes-256-ecb', this.info.EncryptionKey, null);
    newBuffer.buffer = Buffer.from(decipher.update(bytes, 'binary', 'binary') + decipher.final('binary'), 'binary');

    return newBuffer;
  }

  /**
   * Decrypt a buffer
   * @param {number} length buffer length
   * @returns {Replay} decrypted buffer
   */
  encryptBuffer(length) {
    const bytes = this.readBytes(length);
    let newBuffer = new Replay();

    newBuffer.header = this.header;
    newBuffer.info = this.info;
    newBuffer.playerList = this.playerList;

    if (!this.info.IsEncrypted) {
      newBuffer.buffer = bytes;
      return newBuffer;
    };

    const decipher = crypto.createDecipheriv('aes-256-ecb', this.info.EncryptionKey, null);
    newBuffer.buffer = Buffer.from(decipher.update(bytes, 'binary', 'binary') + decipher.final('binary'), 'binary');

    return newBuffer;
  }

  /**
   * Checks the flag for HasStreamingFixes
   * @returns {Boolean}
   */
  hasLevelStreamingFixes() {
    return ((this.header.Flags >> 1) & 1) === 1;
  }

  /**
   * Checks the flag for GameSpecificFrameData
   * @returns {Boolean}
   */
  hasGameSpecificFrameData() {
    return ((this.header.Flags >> 3) & 1) === 1;
  }

  /**
   * Checks the flag for GameSpecificFrameData
   * @returns {Boolean}
   */
  atEnd() {
    return this.offset >= this.buffer.length;
  }

  readBoolean8() {
    return this.readByte()[0] === 1;
  }

  readFName() {
    const isHardcoded = this.readBoolean8();

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

module.exports = Replay;
