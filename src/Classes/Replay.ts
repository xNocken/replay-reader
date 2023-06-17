import { CustomEnum, FRotator, FVector, Header, ReadObjectResult, ReplayParseFunction, Vector4 } from '../../types/lib';
import crypto from 'crypto';
import GlobalData from './GlobalData';
import CustomVersion from './CustomVersion';
import EEngineNetworkCustomVersion from '../versions/EEngineNetworkCustomVersion';

class Replay {
  buffer: Uint8Array;
  lastBit: number = 0;

  isError = false;

  offset = 0;
  offsets: number[] = [];

  float32Array = new Float32Array(1);
  uInt8Float32Array = new Uint8Array(this.float32Array.buffer);

  double64Array = new Float64Array(1);
  uInt8Double64Array = new Uint8Array(this.double64Array.buffer);

  customVersion: CustomVersion;
  header: Header;
  globalData: GlobalData;
  UnrealNames: CustomEnum;

  constructor(input: Uint8Array, globalData: GlobalData, bitCount?: number) {
    this.buffer = new Uint8Array(input);
    this.lastBit = bitCount || this.buffer.length * 8;

    if (globalData) {
      this.UnrealNames = globalData.netFieldParser.getEnum('UnrealNames');
      this.globalData = globalData;
      this.customVersion = globalData.customVersion;
    }
  }

  addOffset(index: number, offset: number) {
    if (!this.canRead(offset)) {
      throw Error('offset is larger than buffer');
    }

    this.offsets[index] = this.lastBit;

    this.lastBit = this.offset + offset;
  }

  addOffsetByte(index: number, offset: number) {
    this.addOffset(index, offset * 8);
  }

  popOffset(index: number, numBits?: number, ignoreError?: boolean) {
    if (this.isError && !ignoreError) {
      throw Error(`Too much was read expected ${numBits}`);
    }

    this.isError = false;

    this.offset = this.lastBit;

    this.lastBit = this.offsets[index];

    if (!this.lastBit) {
      throw Error(`No offset found for index ${index}`);
    }

    for (let i = index; i < this.offsets.length; i += 1) {
      this.offsets.pop();
    }
  }

  resolveError(index: number) {
    if (this.offsets[index] === undefined) {
      return;
    }

    this.isError = false;

    this.offset = this.lastBit;

    this.lastBit = this.offsets[index];

    for (let i = index; i < this.offsets.length; i += 1) {
      this.offsets.pop();
    }
  }

  getLastByte(): number {
    return this.buffer[(this.lastBit >> 3) - 1];
  }

  readBit(): boolean {
    if (this.atEnd() || this.isError) {
      this.isError = true;
      return false;
    }

    const byteOffset = this.offset >>> 3;

    let value = this.buffer[byteOffset] >> (this.offset & 7) & 1;

    this.offset += 1;

    return value === 1;
  }

  readBits(bitCount: number): Uint8Array {
    const buffer = new Uint8Array(Math.ceil(bitCount / 8));
    let readBytes = 0;

    if ((this.offset & 7) === 0) {
      readBytes = bitCount >> 3;
      const bytes = this.readBytes(readBytes);

      buffer.set(bytes, 0);
    }

    let currentBit;
    let currentResultOffset;
    let currentByte = this.buffer[this.offset >>> 3];
    let currentByteBit = 1 << (this.offset & 7);

    for (let i = readBytes * 8; i < bitCount; i++) {
      const bitOffset = this.offset & 7;
      const resultBitOffset = i & 7;

      if (resultBitOffset === 0) {
        currentResultOffset = i >> 3;
        currentBit = 1;
      }

      if (bitOffset === 0) {
        currentByteBit = 1;
        currentByte = this.buffer[this.offset >>> 3];
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

  readBitsToUnsignedInt(count: number): number {
    let val = 0;
    let readBits = 0;

    if ((this.offset & 7) === 0) {
      let index = 0;

      while (count >= 8) {
        val |= this.buffer[this.offset >>> 3] << (index * 8);

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
    let currentByte = this.buffer[this.offset >>> 3];
    let currentByteBit = 1 << (this.offset & 7);

    for (let i = 0; i < count; i++) {
      const bitOffset = this.offset & 7;

      if (bitOffset === 0) {
        currentByteBit = 1;
        currentByte = this.buffer[this.offset >>> 3];
      }

      if (currentByte & currentByteBit) {
        val |= currentBit;
      }

      this.offset += 1;

      currentByteBit *= 2;
      currentBit *= 2;
    }

    return val >>> 0;
  }

  /**
   * Return the next bits from the array thats smaller than maxValue
   */
  readSerializedInt(maxValue: number): number {
    let value = 0;

    let currentByte = this.buffer[this.offset >>> 3];
    let currentByteBit = 1 << (this.offset & 7);

    for (let mask = 1; (value + mask) < maxValue; mask *= 2) {
      const bitOffset = this.offset & 7;

      if (bitOffset === 0) {
        currentByteBit = 1;
        currentByte = this.buffer[this.offset >>> 3];
      }

      if (currentByte & currentByteBit) {
        value |= mask;
      }

      this.offset += 1;

      currentByteBit *= 2;
    }

    return value;
  }

  canRead(number: number): boolean {
    return number + this.offset <= this.lastBit;
  }

  readIntPacked(): number {
    let remaining = true;
    let value = 0;
    let index = 0;

    while (remaining) {
      if (!this.canRead(8)) {
        this.isError = true;

        return 0;
      }

      const currentByte = this.readByte();

      remaining = (currentByte & 1) === 1;

      value += (currentByte >> 1) << (7 * index);

      index += 1;
    }

    return value;
  }

  readBytes(byteCount: number): Uint8Array {
    if ((this.offset & 7) === 0) {
      const start = this.offset >>> 3;

      if (!this.canRead(byteCount)) {
        this.isError = true;

        return new Uint8Array(0);
      }

      const arr = this.buffer.subarray(start, start + byteCount);

      this.offset += byteCount * 8;

      return arr;
    } else {
      const result = new Uint8Array(byteCount);

      for (let i = 0; i < byteCount; i++) {
        result[i] = this.readByte();
      }

      return result;
    }
  }

  readByte(): number {
    return this.readBitsToUnsignedInt(8);
  }

  readInt16(): number {
    const [first, last] = this.readBytes(2);

    const val = first + (last << 8);

    return val | (val & 2 ** 15) * 0x1fffe;
  }

  readUInt16(): number {
    return this.readBitsToUnsignedInt(16);
  }

  readUInt32(): number {
    return this.readBitsToUnsignedInt(32);
  }

  readInt32(): number {
    const bytes = this.readBytes(4);

    return bytes[0]
      + (bytes[1] << 8)
      + (bytes[2] << 16)
      + (bytes[3] << 24);
  }

  readUInt64(): bigint {
    const bytes = this.readBytes(8);

    const lo = bytes[0]
      + (bytes[1] << 8)
      + (bytes[2] << 16)
      + (bytes[3] * 2 ** 24);

    const hi = bytes[4]
      + (bytes[5] << 8)
      + (bytes[6] << 16)
      + (bytes[7] * 2 ** 24);

    return BigInt(lo) + (BigInt(hi) << 32n);
  }

  readString(): string {
    const length = this.readInt32();
    let result = '';

    if (length === 0) {
      return '';
    }

    if (length < 0) {
      if (!this.canRead(length * -2)) {
        this.isError = true;

        return '';
      }

      const bytes = this.readBytes(length * -2);

      for (let i = 0; i < bytes.length - 2; i += 2) {
        result += String.fromCharCode(bytes[i] + (bytes[i + 1] << 8));
      }
    } else {
      if (!this.canRead(length)) {
        this.isError = true;

        return '';
      }

      const bytes = this.readBytes(length);

      for (let i = 0; i < bytes.length - 1; i++) {
        result += String.fromCharCode(bytes[i]);
      }
    }

    return result.trim();
  }

  readFName(): string {
    if (!this.UnrealNames) {
      throw new Error('UnrealNames not set');
    }

    const isHardcoded = this.readBit();

    if (isHardcoded) {
      let nameIndex;

      if (this.customVersion.getEngineNetworkVersion() < EEngineNetworkCustomVersion.ChannelNames) {
        nameIndex = this.readUInt32();
      } else {
        nameIndex = this.readIntPacked();
      }

      return this.UnrealNames[nameIndex];
    }

    const inString = this.readString();
    this.skipBytes(4);

    return inString;
  }

  readFNameByte(): string {
    if (!this.UnrealNames) {
      throw new Error('UnrealNames not set');
    }

    const isHardcoded = this.readByte();

    if (isHardcoded) {
      let nameIndex;

      if (this.customVersion.getEngineNetworkVersion() < EEngineNetworkCustomVersion.ChannelNames) {
        nameIndex = this.readUInt32();
      } else {
        nameIndex = this.readIntPacked();
      }

      return this.UnrealNames[nameIndex];
    }

    const inString = this.readString();
    this.skipBytes(4);

    return inString;
  }

  readBoolean(): boolean {
    const val = this.readBit();

    this.offset += 31;

    return val;
  }

  getBitsLeft(): number {
    return this.lastBit - this.offset;
  }

  /**
   * Append data to current buffer
   */
  appendDataFromChecked(data: Uint8Array, bitCount: number) {
    const newBuffer = new Uint8Array(data.length + this.buffer.length);

    newBuffer.set(this.buffer, 0);
    newBuffer.set(data, this.buffer.length);

    this.buffer = newBuffer;

    this.lastBit += bitCount;
  }

  atEnd(): boolean {
    return this.lastBit <= this.offset;
  }

  readFloat32(): number {
    if (!this.canRead(32)) {
      this.isError = true;

      return 0;
    }

    const result = this.readBytes(4);

    this.uInt8Float32Array[0] = result[0];
    this.uInt8Float32Array[1] = result[1];
    this.uInt8Float32Array[2] = result[2];
    this.uInt8Float32Array[3] = result[3];

    return this.float32Array[0];
  }

  readDouble64(): number {
    if (!this.canRead(64)) {
      this.isError = true;

      return 0;
    }

    const result = this.readBytes(8);

    this.uInt8Double64Array[0] = result[0];
    this.uInt8Double64Array[1] = result[1];
    this.uInt8Double64Array[2] = result[2];
    this.uInt8Double64Array[3] = result[3];
    this.uInt8Double64Array[4] = result[4];
    this.uInt8Double64Array[5] = result[5];
    this.uInt8Double64Array[6] = result[6];
    this.uInt8Double64Array[7] = result[7];

    return this.double64Array[0];
  }

  readGuid(): string {
    const a = this.readUInt32();
    const b = this.readUInt32();
    const c = this.readUInt32();
    const d = this.readUInt32();

    return `${a.toString(16)}-${(b >>> 16).toString(16)}-${(b & 0xFFFF).toString(16)}-${(c >>> 16).toString(16)}-${(c & 0xFFFF).toString(16)}${d.toString(16)}`;
  }

  /**
   * Read an id
   */
  readBytesToHex(length: number = 16): string {
    let result = '';
    const bytes = this.readBytes(length);

    for (let i = 0; i < length; i++) {
      const num = bytes[i].toString(16);

      result += `${num.length - 1 ? '' : '0'}${num}`;
    }

    return result;
  }

  readId(): string {
    return this.readBytesToHex(16);
  }

  /**
   * Read an id
   */
  readNetId(): string {
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

    let bValidHashType = typeHash !== 0;
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

        return this.readBytesToHex(encodedSize);
      }

      return this.readString();
    }

    return "";
  }

  readArray<T>(fn: ReplayParseFunction<T>): T[] {
    const length = this.readUInt32();
    const returnArray: T[] = [];

    for (let i = 0; i < length; i += 1) {
      returnArray.push(fn(this));
    }

    return returnArray;
  }

  readObject<T, U>(fn1: ReplayParseFunction<T>, fn2: ReplayParseFunction<U>): ReadObjectResult<U> {
    const length = this.readUInt32();
    const obj: ReadObjectResult<U> = {};

    for (let i = 0; i < length; i += 1) {
      obj[fn1(this).toString()] = fn2(this);
    }

    return obj;
  }

  readVector3f(): FVector {
    return {
      x: this.readFloat32(),
      y: this.readFloat32(),
      z: this.readFloat32(),
    };
  }

  readVector4f(): Vector4 {
    return {
      x: this.readFloat32(),
      y: this.readFloat32(),
      z: this.readFloat32(),
      w: this.readFloat32(),
    };
  }

  readVector3d(): FVector {
    if (this.customVersion.getEngineNetworkVersion() < EEngineNetworkCustomVersion.PackedVectorLWCSupport) {
      return this.readVector3f();
    }

    return {
      x: this.readDouble64(),
      y: this.readDouble64(),
      z: this.readDouble64(),
    };
  }

  readVector4d(): Vector4 {
    if (this.customVersion.getEngineNetworkVersion() < EEngineNetworkCustomVersion.PackedVectorLWCSupport) {
      return this.readVector4f();
    }

    return {
      x: this.readDouble64(),
      y: this.readDouble64(),
      z: this.readDouble64(),
      w: this.readDouble64(),
    };
  }

  readPackedVector100(): FVector {
    return this.readPackedVector(100, 30);
  }

  readPackedVector10(): FVector {
    return this.readPackedVector(10, 27);
  }

  readPackedVector1(): FVector {
    return this.readPackedVector(1, 24);
  }

  readQuantizedVector(scaleFactor: number): FVector {
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

  readPackedVectorLegacy(scaleFactor: number, maxBits: number): FVector {
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

  serializeQuantizedVector(level: number) {
    switch (level) {
      case 2:
        return this.readPackedVector100();

      case 1:
        return this.readPackedVector10();

      default:
        return this.readPackedVector1();
    }
  }

  readPackedVector(scaleFactor: number, maxBits: number): FVector {
    if (this.customVersion.getEngineNetworkVersion() >= EEngineNetworkCustomVersion.PackedVectorLWCSupport) {
      return this.readQuantizedVector(scaleFactor);
    }

    return this.readPackedVectorLegacy(scaleFactor, maxBits);
  }

  decryptBuffer(length: number, encryptionKey: Buffer): Replay {
    if (!this.globalData) {
      throw new Error('Global data not set');
    }

    const bytes = this.readBytes(length);

    const decipher = crypto.createDecipheriv('aes-256-ecb', encryptionKey, null);
    const newBuffer = Buffer.from(decipher.update(bytes, null, 'binary') + decipher.final('binary'), 'binary');

    const newReplay = new Replay(newBuffer, this.globalData);

    newReplay.header = this.header;

    return newReplay;
  }

  readRotation(): FRotator {
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

  readRotationShort(): FRotator {
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

  readDate(): Date {
    return new Date(Number((this.readUInt64() - 621355968000000000n) / 10000n));
  }

  skipBits(bits: number) {
    this.offset += bits;
  }

  skipBytes(bits: number) {
    this.offset += bits * 8;
  }

  getByteOffset(): number {
    return this.offset >>> 3;
  }

  goTo(offset: number) {
    this.offset = offset;
  }

  goToByte(offset: number) {
    this.offset = offset * 8;
  }

  /**
   * Checks the flag for HasStreamingFixes
   */
  hasLevelStreamingFixes(): boolean {
    return (this.header.flags & 2) === 2;
  }

  /**
   * Checks the flag for HasDeltaCheckpoints
   */
  hasDeltaCheckpoints(): boolean {
    return (this.header.flags & 4) === 4;
  }

  /**
   * Checks the flag for GameSpecificFrameData
   */
  hasGameSpecificFrameData(): boolean {
    return (this.header.flags & 8) === 8;
  }

  /**
   * Reads a debug string. Not used in normal replays
   */
  readDebugString(value: string) {
    const read = this.readString();

    if (value !== read) {
      throw new Error('debug string test failed');
    }
  }
}

export default Replay;
