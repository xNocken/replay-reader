import { BaseResult, BaseStates, Chunks, NextChunkExport } from '../types/lib';
import GlobalData from './Classes/GlobalData';
import Replay from './Classes/Replay';

import { parseCheckpoint } from './chunks/parse-checkpoint';
import parseEvent from './chunks/parse-events';
import { parsePackets } from './chunks/parse-packets';

const parseChunks = (replay: Replay, chunks: Chunks, globalData: GlobalData) => {
  let time = 0;

  if (globalData.options.parseEvents) {
    chunks.events
      .sort((a, b) => a.startTime - b.startTime)
      .forEach((event) => {
        let debugTime;

        if (!globalData.supportedEvents.some((value) => value === event.group)) {
          return;
        }

        if (globalData.options.debug) {
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

        try {
          parseEvent(replay, event, globalData);
        } catch (err) {
          globalData.logger.error(`Error while reading event chunk ${event.group} at ${event.startTime}`);
          replay.resolveError(1);
        }

        globalData.logger.message(`read eventChunk with ${event.chunkSize} bytes in ${Date.now() - debugTime}ms`);
      });
  }

  if (!globalData.options.parsePackets) {
    return;
  }

  if (globalData.options.useCheckpoints && chunks.checkpoints.length) {
    const checkpoint = chunks.checkpoints.slice(-1)[0];

    let debugTime: number;

    if (globalData.options.debug) {
      debugTime = Date.now();
    }

    parseCheckpoint(replay, checkpoint, globalData);

    globalData.logger.message(`read checkpointChunk with ${checkpoint.chunkSize} bytes in ${Date.now() - debugTime}ms`);

    time = checkpoint.endTime;
  }

  for (let i = 0; i < chunks.replayData.length; i++) {
    const { fastForwardTo, stopParsing } = globalData;

    if (stopParsing) {
      break;
    }

    if ((fastForwardTo * 1000) > time) {
      const checkpoint = chunks.checkpoints.reduce(
        (prev, curr) => curr.startTime < (fastForwardTo * 1000) ? curr : prev,
        null,
      );

      if (checkpoint && (time + (globalData.fastForwardThreshold * 1000)) < checkpoint.startTime) {
        let debugTime: number;

        if (globalData.options.debug) {
          debugTime = Date.now();
        }

        globalData.logger.message(`fast forwarding from ${(time / 1000).toFixed(2)} to ${fastForwardTo.toFixed(2)} with checkpoint at ${(checkpoint.startTime / 1000).toFixed(2)}`);

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

        parseCheckpoint(replay, checkpoint, globalData);

        globalData.fastForwardTo = 0;

        time = checkpoint.startTime;

        globalData.logger.message(`read checkpointChunk with ${checkpoint.chunkSize} bytes in ${Date.now() - debugTime}ms`);
      }
    }

    if (time <= chunks.replayData[i].startTime) {
      let debugTime: number;

      if (globalData.options.debug) {
        debugTime = Date.now();
      }

      try {
        const exportData: NextChunkExport<BaseResult, BaseStates> = {
          size: chunks.replayData[i].chunkSize,
          chunks,
          chunk: chunks.replayData[i],
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

      parsePackets(replay, chunks.replayData[i], globalData);
      time = chunks.replayData[i].endTime;

      globalData.logger.message(`read replayDataChunk with ${chunks.replayData[i].chunkSize} bytes in ${Date.now() - debugTime}ms`);
    }
  }
};

export default parseChunks;
