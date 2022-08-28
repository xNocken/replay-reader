import { FVector, Vector4 } from './lib';

export interface ElimPlayer {
  name: string;
  rotation?: Vector4,
  location?: FVector,
  scale?: FVector,
}
