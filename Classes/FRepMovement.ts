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
  bRepServerFrame: boolean;
  bRepServerHandle: boolean;
  serverFrame?: number;
  serverHandle?: number;

  serialize(reader: Replay, globalData: GlobalData, { locationQuatLevel = 2, rotationQuatLevel = 0, velocityQuatLevel = 0 }) {
    this.bSimulatedPhysicSleep = reader.readBit();
    this.bRepPhysics = reader.readBit();

    if (globalData.header.engineNetworkVersion >= 25 && globalData.header.engineNetworkVersion !== 26) {
      this.bRepServerFrame = reader.readBit();
      this.bRepServerHandle = reader.readBit();
    }

    this.location = reader.serializeQuantizedVector(locationQuatLevel);
    this.rotation = rotationQuatLevel ? reader.readRotationShort() : reader.readRotation();
    this.linearVelocity = reader.serializeQuantizedVector(velocityQuatLevel);

    if (this.bRepPhysics) {
      this.angularVelocity = reader.serializeQuantizedVector(velocityQuatLevel);
    }

    if (this.bRepServerFrame) {
      this.serverFrame = reader.readIntPacked();
    }

    if (this.bRepServerHandle) {
      this.serverHandle = reader.readIntPacked();
    }
  }
}
