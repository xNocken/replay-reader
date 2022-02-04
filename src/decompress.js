const ref = require("ref-napi");
const Replay = require("./Classes/Replay");
const GlobalData = require("./utils/globalData");

/**
 * @param {Replay} replay
 * @param {Boolean} isCompressed
 * @param {GlobalData} globalData
 */
const decompress = (replay, isCompressed, globalData) => {
  if (!isCompressed) {
    return replay;
  }

  const decompressedSize = replay.readInt32();
  const compressedSize = replay.readInt32();
  const compressedBuffer = replay.readBytes(compressedSize);

  const dstBuffer = Buffer.allocUnsafe(decompressedSize);

  globalData.oodleLib.OodleLZ_Decompress(
    compressedBuffer,
    compressedSize,
    dstBuffer,
    decompressedSize,
    0,
    0,
    2147483647,
    ref.NULL,
    0,
    ref.NULL,
    ref.NULL,
    ref.NULL,
    0,
    0
  );

  const newReplay = new Replay(dstBuffer);

  newReplay.header = replay.header;
  newReplay.info = replay.info;

  return newReplay;
};

module.exports = decompress;
