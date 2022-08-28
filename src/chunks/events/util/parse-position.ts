import { FVector } from '$types/lib';
import Replay from '../../../Classes/Replay';

const halfMapSize = 131328;

export const parsePosition = (replay: Replay): FVector => {
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
