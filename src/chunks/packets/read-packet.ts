import { Packet } from "$types/replay";
import Replay from "../../Classes/Replay";

export const readPacket = (replay: Replay, timeSeconds: number): Packet => {
  let streamingFix: number;

  if (replay.hasLevelStreamingFixes()) {
    streamingFix = replay.readIntPacked();
  }

  const bufferSize = replay.readInt32();

  if (bufferSize === 0) {
    return {
      state: 1,
      streamingFix,
      size: bufferSize,
      timeSeconds,
    };
  }

  if (bufferSize > 2048 || bufferSize < 0) {
    return {
      state: 2,
      streamingFix,
      size: bufferSize,
      timeSeconds,
    };
  }

  return {
    state: 0,
    streamingFix,
    size: bufferSize,
    timeSeconds,
  };
};
