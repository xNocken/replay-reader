import { BaseResult, BaseStates } from '$types/lib';
import { Packet } from "$types/replay";
import GlobalData from "../../Classes/GlobalData";
import Replay from "../../Classes/Replay";
import { readExternalData } from "./read-external-data";
import { readNetExportGuids } from "./read-net-export-guids";
import { readNetFieldExports } from "./read-nfe-group";
import { readPacket } from "./read-packet";
import { receivedPacket } from "./received-packet";

const receivedRawPacket = <ResultType extends BaseResult>(packet: Packet, replay: Replay, globalData: GlobalData<ResultType>) => {
  let lastByte = replay.getLastByte();

  if (!lastByte) {
    throw Error('Malformed packet: Received packet with 0\'s in last byte of packet');
  }

  let bitSize = (packet.size * 8) - 1;

  while (!((lastByte & 0x80) >= 1)) {
    lastByte *= 2;
    bitSize--;
  }

  replay.addOffset(2, bitSize);

  try {
    receivedPacket(replay, packet.timeSeconds, globalData);
  } catch (ex) {
    console.log(ex);
  }

  replay.popOffset(2, bitSize);
};

export const parsePlaybackPackets = <ResultType extends BaseResult>(replay: Replay, globalData: GlobalData<ResultType>) => {
  if (replay.header.networkVersion >= 6) {
    replay.skipBytes(4); // current level index
  }

  const timeSeconds = replay.readFloat32();

  if (globalData.lastFrameTime !== timeSeconds) {
    try {
      globalData.emitters.parsing.emit('nextFrame', {
        timeSeconds,
        sinceLastFrame: globalData.lastFrameTime - timeSeconds,
        globalData,
        result: globalData.result,
        states: globalData.states,
        setFastForward: globalData.setFastForward,
        stopParsing: globalData.stopParsingFunc,
      });
    } catch (err) {
      console.error(`Error while exporting "nextFrame": ${err.stack}`);
    }

    globalData.lastFrameTime = timeSeconds;
  }

  if (replay.header.networkVersion >= 10) {
    readNetFieldExports(replay, globalData);
    readNetExportGuids(replay, globalData);
  }

  if (replay.hasLevelStreamingFixes()) {
    const numStreamingLevels = replay.readIntPacked();

    for (let i = 0; i < numStreamingLevels; i++) {
      replay.readString();
    }
  } else {
    throw Error('FTransform deserialize not implemented');
  }

  if (replay.hasLevelStreamingFixes()) {
    replay.skipBytes(8);
  }

  readExternalData(replay, globalData);

  if (replay.hasGameSpecificFrameData()) {
    const externalOffsetSize = replay.readUInt64();

    if (externalOffsetSize > 0) {
      replay.skipBytes(Number(externalOffsetSize));
    }
  }

  let done = false;

  while (!done) {
    const packet = readPacket(replay, timeSeconds);

    replay.addOffsetByte(1, packet.size);

    if (packet.state === 0) {
      receivedRawPacket(packet, replay, globalData);
    } else {
      replay.popOffset(1);

      return;
    }

    replay.popOffset(1);
  }
};
