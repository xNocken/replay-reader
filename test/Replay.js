const Replay = require('../src/Classes/Replay');
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
})
