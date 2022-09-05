import { FRotator, FVector } from '../types/lib';
import GlobalData from '../src/Classes/GlobalData';
import Replay from '../src/Classes/Replay';

export class FRepMovement {
  bSimulatedPhysicSleep: boolean;
  bRepPhysics: boolean;
  location: FVector;
  rotation: FRotator
  linearVelocity: FVector;
  angularVelocity: FVector;

  serialize(reader: Replay, globalData: GlobalData, { locationQuatLevel = 2, rotationQuatLevel = 0, velocityQuatLevel = 0 }) {
    this.bSimulatedPhysicSleep = reader.readBit();
    this.bRepPhysics = reader.readBit();

    this.location = reader.readPackedVector(10 ** locationQuatLevel, 24 + (3 * locationQuatLevel));
    this.rotation = rotationQuatLevel ? reader.readRotationShort() : reader.readRotation();
    this.linearVelocity = reader.readPackedVector(10 ** velocityQuatLevel, 24 + (3 * velocityQuatLevel));

    if (this.bRepPhysics) {
      this.angularVelocity = reader.readPackedVector(10 ** velocityQuatLevel, 24 + (3 * velocityQuatLevel));
    }
  }
}
