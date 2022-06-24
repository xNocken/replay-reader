const needle = require('needle');
const Replay = require('./Classes/Replay');
const parseHeader = require('./chunks/parse-header');

const replayInfoStreaming = (metadata, globalData) => {
  const info = {};

  info.lengthInMs = metadata.LengthInMS;
  info.networkVersion = metadata.NetworkVersion;
  info.changelist = metadata.Changelist;
  info.friendlyName = metadata.FriendlyName;
  info.isLive = metadata.bIsLive;
  info.timestamp = new Date(metadata.Timestamp);
  info.isCompressed = metadata.bCompressed;
  info.isEncrypted = false;

  metadata.info = info;
  globalData.info = info;

  return info;
};

const replayChunksStreaming = async (metadata, globalData) => {
  const chunks = {
    replayData: metadata.DataChunks.map((chunk) => ({
      link: chunk.DownloadLink,
      start: chunk.Time1,
      end: chunk.Time2,
      length: chunk.FileSize,
      startPos: 0,
    })),
    checkpoints: metadata.Checkpoints.map((chunk) => ({
      link: chunk.DownloadLink,
      id: chunk.Id,
      group: chunk.Group,
      metadata: chunk.Metadata,
      start: chunk.Time1,
      end: chunk.Time2,
      sizeInBytes: chunk.FileSize,
      startPos: 0,
    })),
    events: metadata.Events.map((chunk) => ({
      link: chunk.DownloadLink,
      eventId: chunk.Id,
      group: chunk.Group,
      metadata: chunk.Metadata,
      startTime: chunk.Time1,
      endtime: chunk.Time2,
      length: chunk.FileSize,
      startPos: 0,
    })),
  };

  let debugDownloadStartTime;
  let debugDownloadFinishTime;
  let debugParseTime;

  if (globalData.debug) {
    debugDownloadStartTime = Date.now();
  }

  const { body, statusCode } = await needle('get', metadata.DownloadLink);

  if (globalData.debug) {
    debugDownloadFinishTime = Date.now();
    debugParseTime = Date.now();
  }

  if (statusCode !== 200) {
    throw new Error('Failed to download the header chunk. Link may be expired');
  }

  const replay = new Replay(body);
  globalData.header = parseHeader(replay);

  if (globalData.debug) {
    console.log(`downloaded headerChunk in ${debugDownloadFinishTime - debugDownloadStartTime}ms and parsed in ${Date.now() - debugParseTime}ms`);
  }

  return chunks;
};

module.exports = {
  replayInfoStreaming,
  replayChunksStreaming,
};
