import needle from 'needle';

import { BaseResult, Checkpoint, Chunks, DataChunk, Event, Meta, MetaDataResult } from '$types/lib';
import GlobalData from './Classes/GlobalData';
import Replay from './Classes/Replay';
import parseHeader from './chunks/parse-header';

export const replayMetaStreaming = <ResultType extends BaseResult>(metadata: MetaDataResult, globalData: GlobalData<ResultType>) => {
  const meta: Meta = {
    lengthInMs: metadata.LengthInMS,
    networkVersion: metadata.NetworkVersion,
    changelist: metadata.Changelist,
    friendlyName: metadata.FriendlyName,
    isLive: metadata.bIsLive,
    timestamp: new Date(metadata.Timestamp),
    isCompressed: metadata.bCompressed,
    isEncrypted: false,
  };

  globalData.meta = meta;

  return meta;
};

export const replayChunksStreaming = async <ResultType extends BaseResult>(metadata: MetaDataResult, globalData: GlobalData<ResultType>): Promise<Chunks> => {
  const chunks: Chunks = {
    replayData: metadata.DataChunks.map((chunk): DataChunk => ({
      link: chunk.DownloadLink,
      startTime: chunk.Time1,
      endTime: chunk.Time2,
      chunkSize: chunk.FileSize,
      startPos: 0,
    })),
    checkpoints: metadata.Checkpoints.map((chunk): Checkpoint => ({
      link: chunk.DownloadLink,
      id: chunk.Id,
      group: chunk.Group,
      metadata: chunk.Metadata,
      startTime: chunk.Time1,
      endTime: chunk.Time2,
      chunkSize: chunk.FileSize,
      startPos: 0,
    })),
    events: metadata.Events.map((chunk): Event => ({
      link: chunk.DownloadLink,
      id: chunk.Id,
      group: chunk.Group,
      metadata: chunk.Metadata,
      startTime: chunk.Time1,
      endTime: chunk.Time2,
      chunkSize: chunk.FileSize,
      startPos: 0,
    })),
  };

  let debugDownloadStartTime: number;
  let debugDownloadFinishTime: number;
  let debugParseTime: number;

  if (globalData.options.debug) {
    debugDownloadStartTime = Date.now();
  }

  const { body, statusCode } = await needle('get', metadata.DownloadLink);

  if (globalData.options.debug) {
    debugDownloadFinishTime = Date.now();
    debugParseTime = Date.now();
  }

  if (statusCode !== 200) {
    throw new Error('Failed to download the header chunk. Link may be expired');
  }

  const replay = new Replay(body);
  globalData.header = parseHeader(replay);

  if (globalData.options.debug) {
    console.log(`downloaded headerChunk in ${debugDownloadFinishTime - debugDownloadStartTime}ms and parsed in ${Date.now() - debugParseTime}ms`);
  }

  return chunks;
};
