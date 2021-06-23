const ooz = require('ooz-wasm');
const Replay = require('./Classes/Replay');

/**
 * @param {Replay} replay
 * @param {Boolean} isCompressed
 */
const decompress = async (replay, isCompressed) => {
  if (!isCompressed) {
    return replay;
  }

  const decompressedSize = replay.readInt32();
  const compressedSize = replay.readInt32();
  const compressedBuffer = replay.readBytes(compressedSize);

  const newReplay = new Replay(Buffer.from(await ooz.decompressUnsafe(compressedBuffer, decompressedSize)));

  newReplay.header = replay.header;
  newReplay.info = replay.info;

  return newReplay;
}

module.exports = decompress;
