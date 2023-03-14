import Replay from './Classes/Replay';
import parseHeader from './chunks/parse-header';
import GlobalData from './Classes/GlobalData';
import { Checkpoint, Chunks, DataChunk, Event } from '../types/lib';
import ELocalFileReplayCustomVersion from './versions/ELocalFileReplayCustomVersion';

const getChunksBinary = (replay: Replay, globalData: GlobalData) => {
  const chunks: Chunks = {
    replayData: [],
    checkpoints: [],
    events: [],
  };

  while (!replay.atEnd()) {
    const chunkType = replay.readUInt32();
    const chunkSize = replay.readInt32();

    replay.addOffsetByte(0, chunkSize);

    switch (chunkType) {
      case 0:
        if (globalData.header) {
          throw new Error('Found multiple header chunks');
        }

        globalData.header = parseHeader(replay, globalData.logger, globalData);
        break;

      case 1: {
        let startTime: number;
        let endTime: number;

        if (globalData.customVersion.getLocalFileReplayVersion() >= ELocalFileReplayCustomVersion.StreamChunkTimes) {
          startTime = replay.readUInt32();
          endTime = replay.readUInt32();
        }

        const dataSize = replay.readUInt32();

        if (globalData.customVersion.getLocalFileReplayVersion() >= ELocalFileReplayCustomVersion.EncryptionSupport) {
          replay.skipBytes(4);
        }

        const startPos = replay.offset;

        const info: DataChunk = {
          startTime,
          endTime,
          startPos,
          chunkSize: dataSize,
        };

        chunks.replayData.push(info);
        break;
      }

      case 2: {
        const info: Checkpoint = {
          id: replay.readString(),
          group: replay.readString(),
          metadata: replay.readString(),
          startTime: replay.readUInt32(),
          endTime: replay.readUInt32(),
          chunkSize: replay.readUInt32(),
          startPos: replay.offset,
        };

        chunks.checkpoints.push(info);
        break;
      }

      case 3: {
        const info: Event = {
          id: replay.readString(),
          group: replay.readString(),
          metadata: replay.readString(),
          startTime: replay.readUInt32(),
          endTime: replay.readUInt32(),
          chunkSize: replay.readUInt32(),
          startPos: replay.offset,
        };

        chunks.events.push(info);
        break;
      }

      default:
        globalData.logger.warn(`Unknown chunk type ${chunkType}`);
    }

    replay.popOffset(0, chunkSize * 8, false);
  }

  return chunks;
};

export default getChunksBinary;
