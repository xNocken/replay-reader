const parseCheckpoint = require("./chunks/parse-checkpoint");
const parseEvent = require("./chunks/parse-events");
const parseReplayData = require("./chunks/parse-packets");

const parseChunks = (replay, chunks, globalData) => {
  let time = 0;

  if (globalData.parseEvents) {
    chunks.events
      .sort((a, b) => a.startTime - b.startTime)
      .forEach((event) => {
        let debugTime;

        if (!globalData.supportedEvents.includes(event.group)) {
          return;
        }

        if (globalData.debug) {
          debugTime = Date.now();
        }

        try {
          globalData.parsingEmitter.emit('nextChunk', {
            size: event.sizeInBytes,
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

        if (globalData.debug) {
          console.log(`read eventChunk with ${event.length} bytes in ${Date.now() - debugTime}ms`);
        }
      });
  }

  if (!globalData.parsePackets) {
    return;
  }

  if (globalData.useCheckpoints && chunks.checkpoints.length) {
    const checkpoint = chunks.checkpoints.slice(-1)[0];

    let debugTime;

    if (globalData.debug) {
      debugTime = Date.now();
    }

    parseCheckpoint(replay, checkpoint, globalData);

    if (globalData.debug) {
      console.log(`read checkpointChunk with ${checkpoint.sizeInBytes} bytes in ${Date.now() - debugTime}ms`);
    }

    time = checkpoint.end;
  }

  for (let i = 0; i < chunks.replayData.length; i++) {
    const { fastForwardTo, stopParsing } = globalData;

    if (stopParsing) {
      break;
    }

    if ((fastForwardTo * 1000) > time) {
      const checkpoint = chunks.checkpoints.reduce(
        (prev, curr) => curr.start < (fastForwardTo * 1000) ? curr : prev,
        null,
      );

      if (checkpoint && (time + (globalData.fastForwardThreshold * 1000)) < checkpoint.start) {
        let debugTime;

        if (globalData.debug) {
          debugTime = Date.now();
        }

        if (globalData.debug) {
          console.log(`fast forwarding from ${(time / 1000).toFixed(2)} to ${fastForwardTo.toFixed(2)} with checkpoint at ${(checkpoint.start / 1000).toFixed(2)}`);
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

        parseCheckpoint(replay, checkpoint, globalData);

        globalData.fastForwardTo = 0;

        time = checkpoint.start;

        if (globalData.debug) {
          console.log(`read checkpointChunk with ${checkpoint.sizeInBytes} bytes in ${Date.now() - debugTime}ms`);
        }
      }
    }

    if (time <= chunks.replayData[i].start) {
      let debugTime;

      if (globalData.debug) {
        debugTime = Date.now();
      }

      try {
        globalData.parsingEmitter.emit('nextChunk', {
          size: chunks.replayData[i].length,
          type: 1,
          chunks,
          chunk: chunks.replayData[i].length,
          setFastForward: globalData.setFastForward,
          stopParsing: globalData.stopParsingFunc,
        });
      } catch (err) {
        console.error(`Error while exporting "nextChunk": ${err.stack}`);
      }

      parseReplayData(replay, chunks.replayData[i], globalData);
      time = chunks.replayData[i].end;

      if (globalData.debug) {
        console.log(`read replayDataChunk with ${chunks.replayData[i].length} bytes in ${Date.now() - debugTime}ms`);
      }
    }
  }
};

module.exports = parseChunks;
