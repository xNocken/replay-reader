import { BaseResult, BaseStates, NextFrameExport } from '../../../types/lib';
import { Packet } from "../../../types/replay";
import GlobalData from "../../Classes/GlobalData";
import Replay from "../../Classes/Replay";
import EEngineNetworkCustomVersion from '../../versions/EEngineNetworkCustomVersion';
import { readExternalData } from "./read-external-data";
import { readNetExportGuids } from "./read-net-export-guids";
import { readNetFieldExports } from "./read-nfe-group";
import { readPacket } from "./read-packet";
import { receivedPacket } from "./received-packet";

const receivedRawPacket = (packet: Packet, replay: Replay, globalData: GlobalData) => {
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

    replay.popOffset(2, bitSize);
  } catch (ex) {
    globalData.logger.error(ex.stack);
    replay.resolveError(2);
  }
};

export const parsePlaybackPackets = (replay: Replay, globalData: GlobalData) => {
  if (globalData.customVersion.getEngineNetworkVersion() >= EEngineNetworkCustomVersion.ChannelNames) {
    replay.skipBytes(4); // current level index
  }

  const timeSeconds = replay.readFloat32();

  if (globalData.lastFrameTime !== timeSeconds) {
    try {
      const exportData: NextFrameExport<BaseResult, BaseStates> = {
        timeSeconds,
        sinceLastFrame: globalData.lastFrameTime - timeSeconds,
        globalData,
        result: globalData.result,
        states: globalData.states,
        setFastForward: globalData.setFastForward,
        stopParsing: globalData.stopParsingFunc,
        logger: globalData.logger,
      };

      globalData.emitters.parsing.emit('nextFrame', exportData);
    } catch (err) {
      globalData.logger.error(`Error while exporting "nextFrame": ${err.stack}`);
    }

    globalData.lastFrameTime = timeSeconds;
  }

  if (globalData.customVersion.getEngineNetworkVersion() >= EEngineNetworkCustomVersion.NetExportSerialization) {
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
