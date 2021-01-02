const ooz = require('ooz-wasm');
const Replay = require('./Classes/Replay');

/**
 * @param {Replay} replay
 * @param {Boolean} isCompressed
 */
const decompress = (replay, isCompressed) => {
  if (!isCompressed) {
    return replay;
  }

  const decompressedSize = replay.readInt32();
  const compressedSize = replay.readInt32();
  const compressedBuffer = replay.readBytes(compressedSize);

  return ooz.decompressUnsafe(compressedBuffer, decompressedSize);
}

module.exports = decompress;
