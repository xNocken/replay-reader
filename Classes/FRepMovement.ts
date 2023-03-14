import { FRotator, FVector } from '../types/lib';
import GlobalData from '../src/Classes/GlobalData';
import Replay from '../src/Classes/Replay';
import EEngineNetworkCustomVersion from '../src/versions/EEngineNetworkCustomVersion';

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

    const eNVersion = globalData.customVersion.getEngineNetworkVersion();

    if (eNVersion >= EEngineNetworkCustomVersion.RepMoveServerFrameAndHandle
      && eNVersion !== EEngineNetworkCustomVersion.Ver21AndViewPitchOnly_DONOTUSE) {
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
