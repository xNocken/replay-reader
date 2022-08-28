import { BaseResult, BaseStates, Chunks } from '$types/lib';
import GlobalData from './Classes/GlobalData';
import Replay from './Classes/Replay';

import { parseCheckpoint } from './chunks/parse-checkpoint';
import parseEvent from './chunks/parse-events';
import { parsePackets } from './chunks/parse-packets';

const parseChunks = <ResultType extends BaseResult>(replay: Replay, chunks: Chunks, globalData: GlobalData<ResultType>) => {
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
          globalData.emitters.parsing.emit('nextChunk', {
            size: event.chunkSize,
            type: 3,
            chunks,
            chunk: event,
            setFastForward: globalData.setFastForward,
            stopParsing: globalData.stopParsingFunc,
          });
        } catch (err) {
          console.error(`Error while exporting "nextChunk": ${err.stack}`);
        }

        try {
          parseEvent(replay, event, globalData);
        } catch (err) {
          console.log('Error while reading event chunk');
        }

        if (globalData.options.debug) {
          console.log(`read eventChunk with ${event.chunkSize} bytes in ${Date.now() - debugTime}ms`);
        }
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

    if (globalData.options.debug) {
      console.log(`read checkpointChunk with ${checkpoint.chunkSize} bytes in ${Date.now() - debugTime}ms`);
    }

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

        if (globalData.options.debug) {
          console.log(`fast forwarding from ${(time / 1000).toFixed(2)} to ${fastForwardTo.toFixed(2)} with checkpoint at ${(checkpoint.startTime / 1000).toFixed(2)}`);
        }

        try {
          globalData.emitters.parsing.emit('nextChunk', {
            size: checkpoint.chunkSize,
            type: 2,
            chunks,
            chunk: checkpoint,
            setFastForward: globalData.setFastForward,
            stopParsing: globalData.stopParsingFunc,
          });
        } catch (err) {
          console.error(`Error while exporting "nextChunk": ${err.stack}`);
        }

        parseCheckpoint(replay, checkpoint, globalData);

        globalData.fastForwardTo = 0;

        time = checkpoint.startTime;

        if (globalData.options.debug) {
          console.log(`read checkpointChunk with ${checkpoint.chunkSize} bytes in ${Date.now() - debugTime}ms`);
        }
      }
    }

    if (time <= chunks.replayData[i].startTime) {
      let debugTime: number;

      if (globalData.options.debug) {
        debugTime = Date.now();
      }

      try {
        globalData.emitters.parsing.emit('nextChunk', {
          size: chunks.replayData[i].chunkSize,
          type: 1,
          chunks,
          chunk: chunks.replayData[i].chunkSize,
          setFastForward: globalData.setFastForward,
          stopParsing: globalData.stopParsingFunc,
        });
      } catch (err) {
        console.error(`Error while exporting "nextChunk": ${err.stack}`);
      }

      parsePackets(replay, chunks.replayData[i], globalData);
      time = chunks.replayData[i].endTime;

      if (globalData.options.debug) {
        console.log(`read replayDataChunk with ${chunks.replayData[i].chunkSize} bytes in ${Date.now() - debugTime}ms`);
      }
    }
  }
};

export default parseChunks;
