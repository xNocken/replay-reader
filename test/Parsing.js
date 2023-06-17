var assert = require('assert');
const { default: Replay } = require('../dist/src/Classes/Replay');
const { parseMeta } = require('../dist/src/chunks/parse-meta');
const { default: GlobalData } = require('../dist/src/Classes/GlobalData');

describe('Meta', () => {
  describe('Server', () => {
    it('should work with 17.21', () => {
      const expected = {
        lengthInMs: 1527494,
        changelist: 2147483647,
        friendlyName: 'Apollo_Terrain',
        timestamp: new Date('2021-08-01T17:10:12.985Z'),
        isLive: false,
        isCompressed: true,
        isEncrypted: false,
        encryptionKey: Buffer.alloc(0),
        fileVersion: 6,
      };

      const info = Buffer.from([0x7F, 0xE2, 0xA2, 0x1C, 0x06, 0x00, 0x00, 0x00, 0xC6, 0x4E, 0x17, 0x00, 0x02, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x7F, 0x0F, 0x00, 0x00, 0x00, 0x41, 0x70, 0x6F, 0x6C, 0x6C, 0x6F, 0x5F, 0x54, 0x65, 0x72, 0x72, 0x61, 0x69, 0x6E, 0x00, 0x00, 0x00, 0x00, 0x00, 0x90, 0x7E, 0xA8, 0x39, 0x0F, 0x55, 0xD9, 0x08, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
      const infoReplay = new Replay(info);
      const globalData = new GlobalData({});

      const parsedData = parseMeta(infoReplay, globalData);

      assert.deepEqual(parsedData, expected);
    });

    it('should work with 15.30', () => {
      const expected = {
        lengthInMs: 1503466,
        changelist: 2147483647,
        friendlyName: 'Apollo_Terrain',
        timestamp: new Date('2021-02-14T18:10:20.715Z'),
        isLive: false,
        isCompressed: true,
        isEncrypted: false,
        encryptionKey: Buffer.alloc(0),
        fileVersion: 6,
      };

      const info = Buffer.from([0x7F, 0xE2, 0xA2, 0x1C, 0x06, 0x00, 0x00, 0x00, 0xEA, 0xF0, 0x16, 0x00, 0x02, 0x00, 0x00, 0x00, 0xFF, 0xFF, 0xFF, 0x7F, 0x0F, 0x00, 0x00, 0x00, 0x41, 0x70, 0x6F, 0x6C, 0x6C, 0x6F, 0x5F, 0x54, 0x65, 0x72, 0x72, 0x61, 0x69, 0x6E, 0x00, 0x00, 0x00, 0x00, 0x00, 0xB0, 0x67, 0xA2, 0xCA, 0x13, 0xD1, 0xD8, 0x08, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00])
      const infoReplay = new Replay(info);
      const globalData = new GlobalData({});

      const parsedData = parseMeta(infoReplay, globalData);

      assert.deepEqual(parsedData, expected);
    });
  });

  describe('Client', () => {
    it('should work with 17.10', () => {
      const expected = {
        lengthInMs: 273622,
        changelist: 16745144,
        friendlyName: 'Unsaved Replay',
        timestamp: new Date('2021-07-06T19:56:23.518Z'),
        isLive: false,
        isCompressed: true,
        isEncrypted: true,
        encryptionKey: Buffer.from([0x7B, 0xD0, 0x61, 0x43, 0xE4, 0x84, 0xF1, 0xAE, 0x15, 0xC4, 0x3A, 0x44, 0xB0, 0xDF, 0x8E, 0x32, 0x01, 0x7B, 0xB1, 0x1A, 0xB4, 0xE4, 0xDD, 0xA4, 0x24, 0xC2, 0xE5, 0x3A, 0xFD, 0x03, 0x25, 0xA3]),
        fileVersion: 6,
      };

      const info = Buffer.from([0x7F, 0xE2, 0xA2, 0x1C, 0x06, 0x00, 0x00, 0x00, 0xD6, 0x2C, 0x04, 0x00, 0x02, 0x00, 0x00, 0x00, 0xB8, 0x82, 0xFF, 0x00, 0xFF, 0xFE, 0xFF, 0xFF, 0x55, 0x00, 0x6E, 0x00, 0x73, 0x00, 0x61, 0x00, 0x76, 0x00, 0x65, 0x00, 0x64, 0x00, 0x20, 0x00, 0x52, 0x00, 0x65, 0x00, 0x70, 0x00, 0x6C, 0x00, 0x61, 0x00, 0x79, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0xE0, 0x97, 0xD1, 0x21, 0xB8, 0x40, 0xD9, 0x08, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00, 0x7B, 0xD0, 0x61, 0x43, 0xE4, 0x84, 0xF1, 0xAE, 0x15, 0xC4, 0x3A, 0x44, 0xB0, 0xDF, 0x8E, 0x32, 0x01, 0x7B, 0xB1, 0x1A, 0xB4, 0xE4, 0xDD, 0xA4, 0x24, 0xC2, 0xE5, 0x3A, 0xFD, 0x03, 0x25, 0xA3]);
      const infoReplay = new Replay(info);
      const globalData = new GlobalData({});

      const parsedData = parseMeta(infoReplay, globalData);

      assert.deepEqual(parsedData, expected);
    });

    it('should work with 15.21', () => {
      const expected = {
        lengthInMs: 464697,
        changelist: 15074916,
        friendlyName: 'Unsaved Replay',
        timestamp: new Date('2021-01-24T15:13:18.663Z'),
        isLive: false,
        isCompressed: true,
        isEncrypted: true,
        encryptionKey: Buffer.from([0xcc, 0x80, 0x47, 0x87, 0x7e, 0xeb, 0x2c, 0xf3, 0x48, 0x32, 0x94, 0x53, 0xe9, 0x71, 0x76, 0xd6, 0xe6, 0xce, 0xe7, 0x9d, 0xee, 0x4c, 0x77, 0x39, 0x12, 0x3e, 0x93, 0xee, 0x76, 0xf1, 0x30, 0xa9]),
        fileVersion: 6,
      };

      const info = Buffer.from([0x7F, 0xE2, 0xA2, 0x1C, 0x06, 0x00, 0x00, 0x00, 0x39, 0x17, 0x07, 0x00, 0x02, 0x00, 0x00, 0x00, 0x64, 0x06, 0xE6, 0x00, 0xFF, 0xFE, 0xFF, 0xFF, 0x55, 0x00, 0x6E, 0x00, 0x73, 0x00, 0x61, 0x00, 0x76, 0x00, 0x65, 0x00, 0x64, 0x00, 0x20, 0x00, 0x52, 0x00, 0x65, 0x00, 0x70, 0x00, 0x6C, 0x00, 0x61, 0x00, 0x79, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x70, 0x25, 0xB9, 0x94, 0x7A, 0xC0, 0xD8, 0x08, 0x01, 0x00, 0x00, 0x00, 0x01, 0x00, 0x00, 0x00, 0x20, 0x00, 0x00, 0x00, 0xCC, 0x80, 0x47, 0x87, 0x7E, 0xEB, 0x2C, 0xF3, 0x48, 0x32, 0x94, 0x53, 0xE9, 0x71, 0x76, 0xD6, 0xE6, 0xCE, 0xE7, 0x9D, 0xEE, 0x4C, 0x77, 0x39, 0x12, 0x3E, 0x93, 0xEE, 0x76, 0xF1, 0x30, 0xA9]);
      const infoReplay = new Replay(info);
      const globalData = new GlobalData({});

      const parsedData = parseMeta(infoReplay, globalData);

      assert.deepEqual(parsedData, expected);
    });
  });
});
