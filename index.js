const Replay = require('./src/Classes/Replay');
const { replayInfo, replayChunks } = require('./src/parse');
const GlobalData = require('./src/utils/globalData');
const fs = require('fs');
const parseChunks = require('./src/parseChunks');
const { replayInfoStreaming, replayChunksStreaming } = require('./src/parseStreaming');
const parseChunksStreaming = require('./src/parseChunksStreaming');
const verifyMetadata = require('./src/utils/verifyMetadata');
let isParsing = false;

const debugStuff = (globalData) => {
  fs.writeFileSync('debug-netGuidToPathName.txt', globalData.debugNetGuidToPathName.map(({ key, val, outer }) => `${key}: ${val} -> ${outer}`).join('\n'));
  fs.writeFileSync('debug-notReadNFE.txt', Object.values(globalData.debugNotReadingGroups).map(({ pathName, properties }) => `${pathName}:\n${Object.values(properties).map(({ name, handle }) => `  ${name}: ${handle}`).join('\n')}`).join('\n\n'))
  fs.writeFileSync('debug-readNFE.txt', Object.values(globalData.netGuidCache.NetFieldExportGroupMap).map(({ pathName, netFieldExports }) => `${pathName}:\n${Object.values(netFieldExports).map(({ name, handle }) => `  ${name}: ${handle}`).join('\n')}`).join('\n\n'))
}

const initGlobalData = (options) => {
  const globalData = new GlobalData(options || {});

  globalData.additionalStates.forEach((stateName) => {
    globalData.states[stateName] = {};
  });

  globalData.handleEventEmitter({
    propertyExportEmitter: globalData.exportEmitter,
    actorDespawnEmitter: globalData.actorDespawnEmitter,
    netDeltaReadEmitter: globalData.netDeltaEmitter,
    parsingEmitter: globalData.parsingEmitter,
  }, globalData);

  return globalData;
}

const parseBinary = (data, options) => {
  if (isParsing) {
    throw Error('Cannot parse multiple replays at once');
  }

  isParsing = true;

  const globalData = initGlobalData(options);
  let info;
  let chunks;
  let events = [];

  try {
    const replay = new Replay(data);

    info = replayInfo(replay, globalData);
    chunks = replayChunks(replay, globalData);
    events = parseChunks(replay, chunks, globalData);
  } catch (err) {
    isParsing = false;

    throw err;
  }

  if (globalData.debug) {
    debugStuff(globalData);
  }

  isParsing = false;

  return {
    header: globalData.header,
    info,
    chunks,
    events,
    ...globalData.result,
  };
}

const parseStreaming = async (metadata, options) => {
  if (isParsing) {
    throw Error('Cannot parse multiple replays at once');
  }

  isParsing = true;

  const globalData = initGlobalData(options);
  let info;
  let chunks;
  let events = [];

  try {
    if (!verifyMetadata(metadata)) {
      throw new Error('The data provided is not a valid metadata file')
    }

    info = replayInfoStreaming(metadata, globalData);
    chunks = await replayChunksStreaming(metadata, globalData);
    events = await parseChunksStreaming(chunks, globalData);
  } catch (err) {
    isParsing = false;

    throw err;
  }

  if (globalData.debug) {
    debugStuff(globalData);
  }

  isParsing = false;

  return {
    header: globalData.header,
    info,
    chunks,
    events,
    ...globalData.result,
  };
}

module.exports = {
  parse: parseBinary,
  parseStreaming,
};
