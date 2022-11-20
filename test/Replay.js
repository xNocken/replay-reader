const { default: Replay } = require('../dist/src/Classes/Replay');
var assert = require('assert');

describe('Replay', () => {
  describe('readInt32', () => {
    it('should return 12345', () => {
      const buffer = Buffer.alloc(4);
      buffer.writeInt32LE(12345);
      const replay = new Replay(buffer);

      assert.equal(replay.readInt32(), 12345);
    });

    it('should return -12345', () => {
      const buffer = Buffer.alloc(4);
      buffer.writeInt32LE(-12345);
      const replay = new Replay(buffer);

      assert.equal(replay.readInt32(), -12345);
    });

    it('should return 0', () => {
      const buffer = Buffer.alloc(4);
      buffer.writeInt32LE(0);
      const replay = new Replay(buffer);

      assert.equal(replay.readInt32(), 0);
    });

    it('should return 2147483647', () => {
      const buffer = Buffer.alloc(4);
      buffer.writeInt32LE(2147483647);
      const replay = new Replay(buffer);

      assert.equal(replay.readInt32(), 2147483647);
    });

    it('should return -2147483647', () => {
      const buffer = Buffer.alloc(4);
      buffer.writeInt32LE(-2147483647);
      const replay = new Replay(buffer);

      assert.equal(replay.readInt32(), -2147483647);
    });
  });

  describe('readUInt32', () => {
    it('should return 3147483648', () => {
      const buffer = Buffer.alloc(4);
      buffer.writeUInt32LE(3147483648);
      const replay = new Replay(buffer);

      assert.equal(replay.readUInt32(), 3147483648);
    });

    it('should return 0', () => {
      const buffer = Buffer.alloc(4);
      buffer.writeUInt32LE(0);
      const replay = new Replay(buffer);

      assert.equal(replay.readUInt32(), 0);
    });

    it('should return 4294967295', () => {
      const buffer = Buffer.alloc(4);
      buffer.writeUInt32LE(4294967295);
      const replay = new Replay(buffer);

      assert.equal(replay.readUInt32(), 4294967295);
    });
  });

  describe('readInt16', () => {
    it('should return 12345', () => {
      const buffer = Buffer.alloc(2);
      buffer.writeInt16LE(12345);
      const replay = new Replay(buffer);

      assert.equal(replay.readInt16(), 12345);
    });

    it('should return -12345', () => {
      const buffer = Buffer.alloc(2);
      buffer.writeInt16LE(-12345);
      const replay = new Replay(buffer);

      assert.equal(replay.readInt16(), -12345);
    });

    it('should return 0', () => {
      const buffer = Buffer.alloc(2);
      buffer.writeInt16LE(0);
      const replay = new Replay(buffer);

      assert.equal(replay.readInt16(), 0);
    });

    it('should return 32767', () => {
      const buffer = Buffer.alloc(2);
      buffer.writeInt16LE(32767);
      const replay = new Replay(buffer);

      assert.equal(replay.readInt16(), 32767);
    });

    it('should return -32768', () => {
      const buffer = Buffer.alloc(2);
      buffer.writeInt16LE(-32768);
      const replay = new Replay(buffer);

      assert.equal(replay.readInt16(), -32768);
    });
  })

  describe('readUInt16', () => {
    it('should return 42768', () => {
      const buffer = Buffer.alloc(2);
      buffer.writeUInt16LE(42768);
      const replay = new Replay(buffer);

      assert.equal(replay.readUInt16(), 42768);
    });

    it('should return 0', () => {
      const buffer = Buffer.alloc(2);
      buffer.writeUInt16LE(0);
      const replay = new Replay(buffer);

      assert.equal(replay.readUInt16(), 0);
    });

    it('should return 65535', () => {
      const buffer = Buffer.alloc(2);
      buffer.writeUInt16LE(65535);
      const replay = new Replay(buffer);

      assert.equal(replay.readUInt16(), 65535);
    });

    it('should return 65535 off bit', () => {
      const buffer = Buffer.alloc(4);
      buffer.writeUInt32LE(0xffffffff);
      const replay = new Replay(buffer);

      replay.skipBits(4);

      assert.equal(replay.readUInt16(), 65535);
    });
  })

  describe('readUInt', () => {
    it('should return 15', () => {
      const buffer = Buffer.alloc(2);
      buffer.writeUInt16LE(0b1111);
      const replay = new Replay(buffer);

      assert.equal(replay.readBitsToUnsignedInt(4), 15);
    });

    it('should return 15 off bit', () => {
      const buffer = Buffer.alloc(2);
      buffer.writeUInt16LE(0b11110000);
      const replay = new Replay(buffer);

      replay.skipBits(4);

      assert.equal(replay.readBitsToUnsignedInt(4), 15);
    });

    it('should work with 20 bits', () => {
      const buffer = Buffer.alloc(4);
      buffer.writeUInt32LE(0xFFFFFF);
      const replay = new Replay(buffer);

      assert.equal(replay.readBitsToUnsignedInt(20), 1048575);
    });

    it('should work with 10 bits random', () => {
      const buffer = Buffer.alloc(2);
      buffer[0] = Math.floor(Math.random() * 255);
      buffer[1] = Math.floor(Math.random() * 255);
      const replay = new Replay(buffer);

      const result = (buffer[0] + (buffer[1] << 8));

      assert.equal(replay.readBitsToUnsignedInt(10), result & 0b1111111111);
    });

    it('should work with 10 bits off bit random', () => {
      const buffer = Buffer.alloc(2);
      buffer[0] = Math.floor(Math.random() * 255);
      buffer[1] = Math.floor(Math.random() * 255);
      const replay = new Replay(buffer);

      replay.skipBits(4);

      const result = (buffer[0] + (buffer[1] << 8)) >> 4;

      assert.equal(replay.readBitsToUnsignedInt(10), result & 0b1111111111);
    });
  })

  describe('readFloat', () => {
    it('should return 1', () => {
      const buffer = Buffer.alloc(4);
      buffer.writeFloatLE(1);
      const replay = new Replay(buffer);

      assert.equal(replay.readFloat32(), 1);
    });

    it('should return 0', () => {
      const buffer = Buffer.alloc(4);
      buffer.writeFloatLE(0);
      const replay = new Replay(buffer);

      assert.equal(replay.readFloat32(), 0);
    });

    it('should return 0.5', () => {
      const buffer = Buffer.alloc(4);
      buffer.writeFloatLE(0.5);
      const replay = new Replay(buffer);

      assert.equal(replay.readFloat32(), 0.5);
    });

    it('should return -0.5', () => {
      const buffer = Buffer.alloc(4);
      buffer.writeFloatLE(-0.5);
      const replay = new Replay(buffer);

      assert.equal(replay.readFloat32(), -0.5);
    });

    it('should return 123456.15', () => {
      const buffer = Buffer.alloc(4);
      buffer.writeFloatLE(123456.15);
      const replay = new Replay(buffer);

      assert.equal(replay.readFloat32(), buffer.readFloatLE());
    });
  })

  describe('readIntPacked', () => {
    for (let i = 0; i < 5; i++) {
      let number = Math.round(Math.random() * 2147483647);
      const origNumber = number;

      const bytes = [];

      while (number && bytes.length < 10) {
        const currentNumber = number & 0x7F;

        number >>= 7;
        bytes.push(Boolean(number) + (currentNumber << 1))
      }

      it(`should return ${origNumber}`, () => {
        const replay = new Replay(Buffer.from(bytes));

        assert.equal(replay.readIntPacked(), origNumber);
      })
    }
  })

  describe('readBits', () => {
    it('should return 1', () => {
      const buffer = Buffer.alloc(4);
      buffer.writeInt32LE(1);
      const replay = new Replay(buffer);

      assert.deepEqual(Array.from(replay.readBits(4)), [1]);
    });

    it('should return 3 and 1', () => {
      const buffer = Buffer.alloc(4);
      buffer[0] = 3;
      buffer[1] = 5;
      const replay = new Replay(buffer);

      assert.deepEqual(Array.from(replay.readBits(9)), [3, 1]);
    });

    it('off bit should work', () => {
      const buffer = Buffer.alloc(4);
      buffer[0] = 0b10001000;
      buffer[1] = 0b10101010;
      const replay = new Replay(buffer);

      replay.skipBits(1);

      const result = (buffer[0] + (buffer[1] << 8)) >> 1;
      assert.deepEqual(Array.from(replay.readBits(9)), [result & 0xff, (result >> 8) & 1]);
    });

    it('more off bit should work', () => {
      const buffer = Buffer.alloc(4);
      buffer[0] = 0b10001000;
      buffer[1] = 0b10101010;
      const replay = new Replay(buffer);

      replay.skipBits(4);

      const result = (buffer[0] + (buffer[1] << 8)) >> 4;
      assert.deepEqual(Array.from(replay.readBits(9)), [result & 0xff, (result >> 8) & 1]);
    });
  })
})
