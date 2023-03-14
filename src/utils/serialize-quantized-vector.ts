import { FVector } from "../../types/lib";
import Replay from "../Classes/Replay";
import EEngineNetworkCustomVersion from '../versions/EEngineNetworkCustomVersion';

export const serializeQuantizedVector = (archive: Replay, defaultVector: FVector): FVector => {
  const bWasSerialized = archive.readBit();

  if (bWasSerialized) {
    const bShouldQuantize = (archive.customVersion.getEngineNetworkVersion() < EEngineNetworkCustomVersion.OptionallyQuantizeSpawnInfo) || archive.readBit();

    if (bShouldQuantize) {
      return archive.readPackedVector(10, 24);
    }

    return archive.readVector3d();
  }

  return defaultVector;
};
