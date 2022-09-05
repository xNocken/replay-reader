import { FVector } from "../../types/lib";
import Replay from "../Classes/Replay";

export const serializeQuantizedVector = (archive: Replay, defaultVector: FVector) => {
  const bWasSerialized = archive.readBit();

  if (bWasSerialized) {
    const bShouldQuantize = (archive.header.engineNetworkVersion < 13) || archive.readBit();

    return bShouldQuantize ? archive.readPackedVector(10, 24) : archive.readVector();
  }

  return defaultVector;
};
