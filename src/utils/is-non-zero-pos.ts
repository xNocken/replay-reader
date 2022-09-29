import { FVector } from '../../types/lib';

export const isNonZeroPos = (pos: FVector) => pos.x !== 0 || pos.y !== 0 || pos.z !== 0;
