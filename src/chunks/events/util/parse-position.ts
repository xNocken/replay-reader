import { FVector } from '../../../../types/lib';
import Replay from '../../../Classes/Replay';

const halfMapSize = 131328;

const parsePositionCompat = (replay: Replay): FVector => {
  const size = replay.readInt32();
  const x = replay.readInt32();
  const y = replay.readInt32();
  const z = replay.readInt32();

  return {
    x: x - (halfMapSize >> (16 - size)),
    y: y - (halfMapSize >> (16 - size)),
    z: z - (halfMapSize >> (16 - size)),
  };
}

export const parsePosition = (replay: Replay): FVector => {
  if (replay.header.major < 22) {
    return parsePositionCompat(replay);
  }

  const size = replay.readInt32();
  const componentBits = size & 63;
  const bits = ((componentBits + 7) >> 3) * 8;

  const x = replay.readBitsToUnsignedInt(bits);
  const y = replay.readBitsToUnsignedInt(bits);
  const z = replay.readBitsToUnsignedInt(bits);

  const signBit = 1 << (bits - 1);

  const xSign = (x ^ signBit) - signBit;
  const ySign = (y ^ signBit) - signBit;
  const zSign = (z ^ signBit) - signBit;

  return {
    x: xSign,
    y: ySign,
    z: zSign,
  };
}
