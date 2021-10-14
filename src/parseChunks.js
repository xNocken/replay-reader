const parseCheckpoint = require("./checkpoint");
const parseEvent = require("./event");
const parseReplayData = require("./replayData");

const parseChunks = async (replay, chunks, globalData) => {
  const events = [];
  let time = 0;

  if (globalData.parseEvents) {
    chunks.events.forEach((event) => {
      events.push(parseEvent(replay, event));
    });
  }

  if (globalData.useCheckpoints) {
    const checkpoint = chunks.checkpoints.splice(-1)[0];
    await parseCheckpoint(replay, checkpoint, globalData)

    time = checkpoint.end;
  }

  for (let i = 0; i < chunks.replayData.length; i++) {
    const { fastForwardTo } = globalData;

    if ((fastForwardTo * 1000) > time) {
      const checkpoint = chunks.checkpoints.reduce((prev, curr) => curr.start < (fastForwardTo * 1000) ? curr : prev, null);

      if (checkpoint && (time + (globalData.fastForwardThreshold * 1000)) < checkpoint.start) {
        if (globalData.debug) {
          console.log(`fast forwarding from ${(time / 1000).toFixed(2)} to ${fastForwardTo.toFixed(2)} with checkpoint at ${(checkpoint.start / 1000).toFixed(2)}`);
        }

        await parseCheckpoint(replay, checkpoint, globalData)

        globalData.fastForwardTo = 0;

        time = checkpoint.start;
      }
    }

    if (time <= chunks.replayData[i].start) {
      await parseReplayData(replay, chunks.replayData[i], globalData);
      time = chunks.replayData[i].end;
    }
  }

  return events;
};

module.exports = parseChunks;
