import { FVector } from "../../types/lib";
import Replay from "../Classes/Replay";

export const serializeQuantizedVector = (archive: Replay, defaultVector: FVector): FVector => {
  const bWasSerialized = archive.readBit();

  if (bWasSerialized) {
    const bShouldQuantize = (archive.header.engineNetworkVersion < 13) || archive.readBit();

    if (bShouldQuantize) {
      return archive.readPackedVector(10, 24);
    }

    return archive.readVector3d();
  }

  return defaultVector;
};
