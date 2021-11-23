const needle = require('needle');
const parseCheckpoint = require("./checkpoint");
const Replay = require('./Classes/Replay');
const parseEvent = require("./event");
const parseReplayData = require("./replayData");

const getChunk = async (url, globalData) => {
  const { body, statusCode } = await needle('get', url);

  if (statusCode !== 200) {
    throw new Error('Failed to download chunk. Link may be expired');
  }

  const replay = new Replay(body);

  replay.header = globalData.header;
  replay.info = globalData.info;

  return replay;
}

const findAndParseCheckpoint = async (chunks, currentTime, targetTime, globalData) => {
  const { checkpoints } = chunks;
  let checkpoint;
  let index = 0;

  while (checkpoints[index] && checkpoints[index].start <= targetTime) {
    checkpoint = checkpoints[index];
    index += 1;
  }

  if (!checkpoint || (currentTime + (globalData.fastForwardThreshold * 1000)) > checkpoint.start) {
    return false;
  }

  let debugTime;
  let debugTimeDownload;
  let debugTimeDownloadFinish;

  if (globalData.debug) {
    debugTimeDownload = Date.now();
  }

  const replay = await getChunk(checkpoint.link, globalData);

  if (globalData.debug) {
    debugTimeDownloadFinish = Date.now();
    debugTime = Date.now();
  }

  try {
    globalData.parsingEmitter.emit('nextChunk', {
      size: checkpoint.sizeInBytes,
      type: 2,
      chunks,
      chunk: checkpoint,
      setFastForward: globalData.setFastForward,
      stopParsing: globalData.stopParsingFunc,
    });
  } catch (err) {
    console.error(`Error while exporting "nextChunk": ${err.stack}`);
  }

  await parseCheckpoint(replay, checkpoint, globalData);

  if (globalData.debug) {
    console.log(`downloaded checkpointChunk with ${checkpoint.sizeInBytes} bytes in ${debugTimeDownloadFinish - debugTimeDownload}ms and parsed it in ${Date.now() - debugTime}ms`)
  }

  return checkpoint.end;
}

const parseChunksStreaming = async (chunks, globalData) => {
  const events = [];
  const canBeParsed = [];
  let time = 0;
  let isParsing = false;
  let isFastForwarding = false;
  let downloadIndex = 0;
  let parseIndex = 0;
  let downloadAmount = 0;
  let exitFunction;

  if (globalData.parseEvents) {
    let continueParsing;
    let eventDownloadCount = 0;

    for (let i = 0; i < chunks.events.length; i++) {
      const event = chunks.events[i];
      let debugTime;
      let debugTimeDownload;
      let debugTimeDownloadFinish;

      if (globalData.debug) {
        debugTimeDownload = Date.now();
      }

      await new Promise((resolve, reject) => {
        continueParsing = resolve;

        if (eventDownloadCount < globalData.maxConcurrentEventDownloads) {
          resolve();
        }
      });

      eventDownloadCount += 1;
      getChunk(event.link, globalData).then((replay) => {
        if (globalData.debug) {
          debugTimeDownloadFinish = Date.now();
          debugTime = Date.now();
        }

        try {
          globalData.parsingEmitter.emit('nextChunk', {
            size: event.length,
            type: 3,
            chunks,
            chunk: event,
            setFastForward: globalData.setFastForward,
            stopParsing: globalData.stopParsingFunc,
          });
        } catch (err) {
          console.error(`Error while exporting "nextChunk": ${err.stack}`);
        }

        events.push(parseEvent(replay, event));
        eventDownloadCount -= 1;

        continueParsing();

        if (globalData.debug) {
          console.log(`downloaded eventChunk with ${event.length} bytes in ${debugTimeDownloadFinish - debugTimeDownload}ms and parsed it in ${Date.now() - debugTime}ms`)
        }
      })
    };
  }

  if (!globalData.parsePackets) {
    return events;
  }

  if (globalData.useCheckpoints) {
    const newTime = await findAndParseCheckpoint(chunks, time, Infinity, globalData);

    if (newTime) {
      time = newTime;

      let index = 0;

      while (chunks.replayData[index + 1].start <= time) {
        index += 1;
      }

      parseIndex = index;
      downloadIndex = index;
    }
  }

  const downloadNextChunk = async () => {
    let wasFastForwarded = false;
    if (isFastForwarding) {
      if (globalData.stopParsing) {
        exitFunction();
      }

      return;
    }

    if (!isParsing) {
      while (canBeParsed[parseIndex]) {
        const chunk = canBeParsed[parseIndex];

        if (time > chunk.start) {
          parseIndex += 1;
        }

        let parseStartTime;

        if (globalData.debug) {
          parseStartTime = Date.now();
        }

        parseIndex += 1;
        isParsing = true;

        try {
          globalData.parsingEmitter.emit('nextChunk', {
            size: chunk.chunk.length,
            type: 3,
            chunks,
            chunk: chunk.chunk,
            setFastForward: globalData.setFastForward,
            stopParsing: globalData.stopParsingFunc,
          });
        } catch (err) {
          console.error(`Error while exporting "nextChunk": ${err.stack}`);
        }

        await parseReplayData(chunk.replay, chunk.chunk, globalData);
        time = chunk.chunk.end;

        if (globalData.debug) {
          console.log(`downloaded dataChunk at ${chunk.chunk.start / 1000}s with ${chunk.chunk.length} bytes in ${chunk.downloadTime}ms and parsed it in ${Date.now() - parseStartTime}ms`)
        }

        if (time < globalData.fastForwardTo * 1000) {
          const fastForwardTarget = globalData.fastForwardTo;

          isFastForwarding = true;
          const newTime = await findAndParseCheckpoint(chunks, time, globalData.fastForwardTo * 1000, globalData);
          isFastForwarding = false;

          if (newTime) {
            if (globalData.debug) {
              console.log(`fastForwarded from ${time / 1000}s to ${fastForwardTarget}s using checkpoint at ${newTime / 1000}s`);
            }

            time = newTime;

            let index = 0;

            while (chunks.replayData[index + 1] && chunks.replayData[index + 1].start <= time) {
              index += 1;
            }

            parseIndex = index;
            downloadIndex = index;
            wasFastForwarded = true;
          }
        }

        isParsing = false;
      }
    }

    if (chunks.replayData.length <= downloadIndex) {
      if (!isParsing && downloadAmount === 0) {
        exitFunction();
      }

      return;
    }

    if (downloadAmount >= globalData.maxConcurrentDownloads) {
      return;
    }

    const currentIndex = downloadIndex;
    downloadIndex += 1;

    const chunk = chunks.replayData[currentIndex];

    downloadAmount += 1;

    let downloadStartTime;

    if (globalData.debug) {
      downloadStartTime = Date.now();
    }

    getChunk(chunk.link, globalData).then((replay) => {
      canBeParsed[currentIndex] = {
        chunk,
        replay,
        downloadTime: Date.now() - downloadStartTime,
      };

      downloadAmount -= 1;

      downloadNextChunk();
    });

    downloadNextChunk();
  }

  downloadNextChunk();

  await new Promise((resolve) => {
    exitFunction = resolve;
  });

  return events;
};

module.exports = parseChunksStreaming;
