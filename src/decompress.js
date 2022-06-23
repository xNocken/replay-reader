const Replay = require("./Classes/Replay");

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
    0,
    0,
    0,
    0,
    0,
    0,
    0,
    0,
  );

  const newReplay = new Replay(dstBuffer);

  newReplay.header = replay.header;
  newReplay.info = replay.info;

  return newReplay;
};

module.exports = decompress;
