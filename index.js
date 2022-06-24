const Replay = require('./src/Classes/Replay');
const replayChunks = require('./src/get-chunks-binary');
const GlobalData = require('./src/Classes/GlobalData');
const fs = require('fs');
const parseChunks = require('./src/parse-chunks-binary');
const { replayInfoStreaming, replayChunksStreaming } = require('./src/get-chunks-streaming');
const parseChunksStreaming = require('./src/parse-chunks-streaming');
const verifyMetadata = require('./src/utils/verify-metadata');
const parseMeta = require('./src/chunks/parse-meta');
let isParsing = false;

const debugStuff = (globalData) => {
  fs.writeFileSync('debug-netGuidToPathName.txt', globalData.debugNetGuidToPathName.map(({ key, val, outer }) => `${key}: ${val} -> ${outer}`).join('\n'));
  fs.writeFileSync('debug-notReadNFE.txt', Object.values(globalData.debugNotReadingGroups).map(({ pathName, properties }) => `${pathName}:\n${Object.values(properties).map(({ name, handle }) => `  ${name}: ${handle}`).join('\n')}`).join('\n\n'));
  fs.writeFileSync('debug-readNFE.txt', Object.values(globalData.netGuidCache.NetFieldExportGroupMap).map(({ pathName, netFieldExports }) => `${pathName}:\n${Object.values(netFieldExports).map(({ name, handle }) => `  ${name}: ${handle}`).join('\n')}`).join('\n\n'));
};

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
};

const parseBinary = (data, options) => {
  if (isParsing) {
    throw Error('Cannot parse multiple replays at once');
  }

  isParsing = true;

  const globalData = initGlobalData(options);
  let info;
  let chunks;

  try {
    const replay = new Replay(data);

    info = parseMeta(replay, globalData);
    chunks = replayChunks(replay, globalData);
    parseChunks(replay, chunks, globalData);
  } catch (err) {
    isParsing = false;

    throw err;
  }

  if (globalData.debug) {
    debugStuff(globalData);
  }

  isParsing = false;

  const result = {
    header: globalData.header,
    info,
    ...globalData.result,
  };

  if (globalData.parseEvents) {
    result.events = {
      chests: globalData.eventData.chests,
      safeZones: globalData.eventData.safeZones,
      players: Object.values(globalData.eventData.players),
    };
  }

  if (globalData.exportChunks) {
    result.chunks = chunks;
  }

  return result;
};

const parseStreaming = async (metadata, options) => {
  if (isParsing) {
    throw Error('Cannot parse multiple replays at once');
  }

  isParsing = true;

  const globalData = initGlobalData(options);
  let info;
  let chunks;

  try {
    if (!verifyMetadata(metadata)) {
      throw new Error('The data provided is not a valid metadata file');
    }

    info = replayInfoStreaming(metadata, globalData);
    chunks = await replayChunksStreaming(metadata, globalData);
    await parseChunksStreaming(chunks, globalData);
  } catch (err) {
    isParsing = false;

    throw err;
  }

  if (globalData.debug) {
    debugStuff(globalData);
  }

  isParsing = false;

  const result = {
    header: globalData.header,
    info,
    ...globalData.result,
  };

  if (globalData.parseEvents) {
    result.events = {
      chests: globalData.eventData.chests,
      safeZones: globalData.eventData.safeZones,
      players: Object.values(globalData.eventData.players),
    };
  }

  if (globalData.exportChunks) {
    result.chunks = chunks;
  }

  return result;
};

module.exports = {
  parse: parseBinary,
  parseStreaming,
};
