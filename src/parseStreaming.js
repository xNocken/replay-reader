const needle = require('needle');
const Info = require('./Classes/Info');
const Replay = require('./Classes/Replay');
const parseHeader = require('./header');
const GlobalData = require('./utils/globalData');

/**
 * Parse the replays meta
 *
 * @returns {Info} Informations about the replay
 */
const replayInfoStreaming = (metadata, globalData) => {
  const info = new Info();

  info.LengthInMs = metadata.LengthInMS;
  info.NetworkVersion = metadata.NetworkVersion;
  info.Changelist = metadata.Changelist;
  info.FriendlyName = metadata.FriendlyName;
  info.IsLive = metadata.bIsLive;
  info.Timestamp = new Date(metadata.Timestamp);
  info.IsCompressed = metadata.bCompressed;
  info.IsEncrypted = false;

  metadata.info = info;
  globalData.info = info;

  return info;
};

/**
* Parse the replays meta
* @param {GlobalData} globalData globals
*/
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
    console.log(`downloaded headerChunk in ${debugDownloadFinishTime - debugDownloadStartTime}ms and parsed in ${Date.now() - debugParseTime}ms`)
  }

  return chunks;
}

module.exports = {
  replayInfoStreaming,
  replayChunksStreaming,
};
