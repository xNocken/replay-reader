import { parseCheckpoint } from "./chunks/parse-checkpoint";
import Replay from './Classes/Replay';
import parseEvent from "./chunks/parse-events";
import { parsePackets } from "./chunks/parse-packets";
import GlobalData from './Classes/GlobalData';
import { BaseResult, BaseStates, Checkpoint, Chunks, DownloadedDataChunk, DownloadProcessResponse, NextChunkExport } from '../types/lib';
import { fork } from 'child_process';

const getChunk = (url: string, globalData: GlobalData) => {
  if (!globalData.downloadProcess) {
    globalData.downloadProcess = fork(require.resolve('./download-process'));

    globalData.downloadProcess.on('message', (res) => {
      const { url, body, statusCode } = res as DownloadProcessResponse;
      const handleFunc = globalData.downloadProcessResponses[url];

      if (!handleFunc) {
        globalData.logger.error(`No handler for ${url}`);

        return;
      }

      handleFunc(body, statusCode);
    });
  }

  globalData.downloadProcess.send(url);

  return new Promise<Replay>((resolve, reject) => {
    globalData.downloadProcessResponses[url] = (body: any, statusCode: number) => {
      if (statusCode !== 200) {
        reject(new Error('Failed to download chunk. Link may be expired'));

        return;
      }

      const replay = new Replay(Buffer.from(body), globalData);

      replay.header = globalData.header;

      resolve(replay);
    };
  });
};

const findAndParseCheckpoint = async (chunks: Chunks, currentTime: number, targetTime: number, globalData: GlobalData) => {
  const { checkpoints } = chunks;
  let checkpoint: Checkpoint;
  let index = 0;

  while (checkpoints[index] && checkpoints[index].startTime <= targetTime) {
    checkpoint = checkpoints[index];
    index += 1;
  }

  if (!checkpoint || (currentTime + (globalData.options.fastForwardThreshold * 1000)) > checkpoint.startTime) {
    return false;
  }

  let debugTime: number;
  let debugTimeDownload: number;
  let debugTimeDownloadFinish: number;

  if (globalData.options.debug) {
    debugTimeDownload = Date.now();
  }

  const replay = await getChunk(checkpoint.link, globalData);

  if (globalData.options.debug) {
    debugTimeDownloadFinish = Date.now();
    debugTime = Date.now();
  }

  try {
    const exportData: NextChunkExport<BaseResult, BaseStates> = {
      size: checkpoint.chunkSize,
      chunks,
      chunk: checkpoint,
      setFastForward: globalData.setFastForward,
      stopParsing: globalData.stopParsingFunc,
      logger: globalData.logger,
      globalData: globalData,
      result: globalData.result,
      states: globalData.states,
    };
    globalData.emitters.parsing.emit('nextChunk', exportData);
  } catch (err) {
    globalData.logger.error(`Error while exporting "nextChunk": ${err.stack}`);
  }

  await parseCheckpoint(replay, checkpoint, globalData);

  if (globalData.options.debug) {
    globalData.logger.message(`downloaded checkpointChunk with ${checkpoint.chunkSize} bytes in ${debugTimeDownloadFinish - debugTimeDownload}ms and parsed it in ${Date.now() - debugTime}ms`);
  }

  return checkpoint.endTime;
};

export const parseChunksStreaming = async (chunks: Chunks, globalData: GlobalData) => {
  const canBeParsed: DownloadedDataChunk[] = [];
  const eventPromises = [];
  let time = 0;
  let isParsing = false;
  let isFastForwarding = false;
  let downloadIndex = 0;
  let parseIndex = 0;
  let downloadAmount = 0;
  let exitFunction: () => void;
  let doneBeforeFunc = false;

  const events = [];

  let continueParsing: () => void;
  let eventDownloadCount = 0;

  for (let i = 0; i < chunks.events.length; i++) {
    const event = chunks.events[i];
    let debugTime: number;
    let debugTimeDownload: number;
    let debugTimeDownloadFinish: number;
    let debugIsRequired = false;

    if (!globalData.supportedEvents.find((eventType) => eventType === event.group)) {
      continue;
    }

    if (!globalData.options.parseEvents && !globalData.mustBeParsedEvents.some((eventType) => eventType === event.group)) {
      continue;
    }

    if (!globalData.options.parseEvents) {
      debugIsRequired = true;
    }

    if (globalData.options.debug) {
      debugTimeDownload = Date.now();
    }

    await new Promise<void>((resolve) => {
      continueParsing = resolve;

      if (eventDownloadCount < globalData.options.maxConcurrentEventDownloads) {
        resolve();
      }
    });

    eventPromises.push(new Promise<void>(async (resolve) => {
      eventDownloadCount += 1;

      getChunk(event.link, globalData).then((replay) => {
        if (globalData.options.debug) {
          debugTimeDownloadFinish = Date.now();
          debugTime = Date.now();
        }

        try {
          const exportData: NextChunkExport<BaseResult, BaseStates> = {
            size: event.chunkSize,
            chunks,
            chunk: event,
            setFastForward: globalData.setFastForward,
            stopParsing: globalData.stopParsingFunc,
            logger: globalData.logger,
            globalData: globalData,
            result: globalData.result,
            states: globalData.states,
          };

          globalData.emitters.parsing.emit('nextChunk', exportData);
        } catch (err) {
          globalData.logger.error(`Error while exporting "nextChunk": ${err.stack}`);
        }

        events.push(parseEvent(replay, event, globalData));
        eventDownloadCount -= 1;

        continueParsing();
        resolve();

        if (globalData.options.debug) {
          globalData.logger.message(`downloaded ${debugIsRequired ? 'required ' : ''}eventChunk with ${event.chunkSize} bytes in ${debugTimeDownloadFinish - debugTimeDownload}ms and parsed it in ${Date.now() - debugTime}ms`);
        }
      });
    }));
  };

  await Promise.all(eventPromises);

  if (!globalData.options.parsePackets) {
    return;
  }

  if (globalData.options.useCheckpoints) {
    const newTime = await findAndParseCheckpoint(chunks, time, Infinity, globalData);

    if (newTime) {
      time = newTime;

      let index = 0;

      while (chunks.replayData[index + 1] && chunks.replayData[index + 1].startTime <= time) {
        index += 1;
      }

      parseIndex = index;
      downloadIndex = index;
    }
  }

  const downloadNextChunk = async () => {
    if (isFastForwarding) {
      return;
    }

    if (globalData.stopParsing) {
      if (!exitFunction) {
        doneBeforeFunc = true;

        return;
      }

      exitFunction();

      return;
    }

    if (!isParsing) {
      while (canBeParsed[parseIndex]) {
        const chunk = canBeParsed[parseIndex];

        if (time > chunk.chunk.startTime) {
          parseIndex += 1;

          continue;
        }

        let parseStartTime: number;

        if (globalData.options.debug) {
          parseStartTime = Date.now();
        }

        parseIndex += 1;
        isParsing = true;

        try {
          const exportData: NextChunkExport<BaseResult, BaseStates> = {
            size: chunk.chunk.chunkSize,
            chunks,
            chunk: chunk.chunk,
            setFastForward: globalData.setFastForward,
            stopParsing: globalData.stopParsingFunc,
            logger: globalData.logger,
            globalData: globalData,
            result: globalData.result,
            states: globalData.states,
          };

          globalData.emitters.parsing.emit('nextChunk', exportData);
        } catch (err) {
          globalData.logger.error(`Error while exporting "nextChunk": ${err.stack}`);
        }

        await parsePackets(chunk.replay, chunk.chunk, globalData);
        time = chunk.chunk.endTime;

        if (globalData.options.debug) {
          globalData.logger.message(`downloaded dataChunk at ${chunk.chunk.startTime / 1000}s with ${chunk.chunk.chunkSize} bytes in ${chunk.downloadTime}ms and parsed it in ${Date.now() - parseStartTime}ms`);
        }

        if (time < globalData.fastForwardTo * 1000) {
          const fastForwardTarget = globalData.fastForwardTo;

          isFastForwarding = true;
          const newTime = await findAndParseCheckpoint(chunks, time, globalData.fastForwardTo * 1000, globalData);
          isFastForwarding = false;

          if (newTime) {
            if (globalData.options.debug) {
              globalData.logger.message(`fastForwarded from ${time / 1000}s to ${fastForwardTarget}s using checkpoint at ${newTime / 1000}s`);
            }

            time = newTime;

            let index = 0;

            while (chunks.replayData[index + 1] && chunks.replayData[index + 1].startTime <= time) {
              index += 1;
            }

            parseIndex = index;
            downloadIndex = index;
          }
        }

        isParsing = false;
      }
    }

    if (chunks.replayData.length <= downloadIndex) {
      if (!isParsing && downloadAmount === 0) {
        if (!exitFunction) {
          doneBeforeFunc = true;

          return;
        }

        exitFunction();
      }

      return;
    }

    if (downloadAmount >= globalData.options.maxConcurrentDownloads) {
      return;
    }

    const currentIndex = downloadIndex;
    downloadIndex += 1;

    const chunk = chunks.replayData[currentIndex];

    downloadAmount += 1;

    let downloadStartTime: number;

    if (globalData.options.debug) {
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
  };

  downloadNextChunk();

  await new Promise<void>((resolve) => {
    exitFunction = () => {
      globalData.downloadProcess?.kill();
      resolve();
    };

    if (doneBeforeFunc) {
      exitFunction();
    }
  });
};
