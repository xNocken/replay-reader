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

const parseChunksStreaming = async (chunks, globalData) => {
  const events = [];
  let time = 0;

  if (globalData.parseEvents) {
    for (let i = 0; i < chunks.events.length; i++) {
      const event = chunks.events[i];
      let debugTime;
      let debugTimeDownload;
      let debugTimeDownloadFinish;

      if (globalData.debug) {
        debugTimeDownload = Date.now();
      }

      const replay = await getChunk(event.link, globalData);

      if (globalData.debug) {
        debugTimeDownloadFinish = Date.now();
        debugTime = Date.now();
      }

      events.push(parseEvent(replay, event));

      if (globalData.debug) {
        console.log(`downloaded eventChunk with ${event.length} bytes in ${debugTimeDownloadFinish - debugTimeDownload}ms and parsed it in ${Date.now() - debugTime}ms`)
      }
    };
  }

  if (globalData.useCheckpoints) {
    const checkpoint = chunks.checkpoints.splice(-1)[0];
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

    await parseCheckpoint(replay, checkpoint, globalData);

    if (globalData.debug) {
      console.log(`downloaded checkpointChunk with ${checkpoint.sizeInBytes} bytes in ${debugTimeDownloadFinish - debugTimeDownload}ms and parsed it in ${Date.now() - debugTime}ms`)
    }

    time = checkpoint.end;
  }

  for (let i = 0; i < chunks.replayData.length; i++) {
    const { fastForwardTo } = globalData;

    if ((fastForwardTo * 1000) > time) {
      const checkpoint = chunks.checkpoints.reduce((prev, curr) => curr.start < (fastForwardTo * 1000) ? curr : prev, null);

      if (checkpoint && (time + (globalData.fastForwardThreshold * 1000)) < checkpoint.start) {
        let debugTime;
        let debugTimeDownload;
        let debugTimeDownloadFinish;

        if (globalData.debug) {
          debugTimeDownload = Date.now();
        }

        if (globalData.debug) {
          console.log(`fast forwarding from ${(time / 1000).toFixed(2)} to ${fastForwardTo.toFixed(2)} with checkpoint at ${(checkpoint.start / 1000).toFixed(2)}`);
        }

        const replay = await getChunk(checkpoint.link, globalData);

        if (globalData.debug) {
          debugTimeDownloadFinish = Date.now();
          debugTime = Date.now();
        }

        await parseCheckpoint(replay, checkpoint, globalData)

        globalData.fastForwardTo = 0;

        time = checkpoint.start;

        if (globalData.debug) {
          console.log(`downloaded checkpointChunk with ${checkpoints.sizeInBytes} bytes in ${debugTimeDownloadFinish - debugTimeDownload}ms and parsed in ${Date.now() - debugTime}ms`)
        }
      }
    }

    if (time <= chunks.replayData[i].start) {
      let debugTime;
      let debugTimeDownload;
      let debugTimeDownloadFinish;

      if (globalData.debug) {
        debugTimeDownload = Date.now();
      }

      const replay = await getChunk(chunks.replayData[i].link, globalData);

      if (globalData.debug) {
        debugTimeDownloadFinish = Date.now();
        debugTime = Date.now();
      }

      await parseReplayData(replay, chunks.replayData[i], globalData);
      time = chunks.replayData[i].end;

      if (globalData.debug) {
        console.log(`downloaded replayDataChunk with ${chunks.replayData[i].length} bytes in ${debugTimeDownloadFinish - debugTimeDownload}ms and parsed in ${Date.now() - debugTime}ms`)
      }
    }
  }

  return events;
};

module.exports = parseChunksStreaming;
