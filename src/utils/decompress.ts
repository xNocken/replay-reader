import GlobalData from '../Classes/GlobalData';
import Replay from '../Classes/Replay';

export const decompress = (replay: Replay, globalData: GlobalData) => {
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

  return newReplay;
};
