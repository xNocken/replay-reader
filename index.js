const Replay = require('./src/Classes/Replay');
const { replayInfo, replayChunks } = require('./src/parse');
const GlobalData = require('./src/utils/globalData');
const fs = require('fs');
const parseChunks = require('./src/parseChunks');
const { replayInfoStreaming, replayChunksStreaming } = require('./src/parseStreaming');
const parseChunksStreaming = require('./src/parseChunksStreaming');
const verifyMetadata = require('./src/utils/verifyMetadata');
let isParsing = false;

const parse = async (data, options) => {
  if (isParsing) {
    throw Error('Cannot parse multiple replays at once');
  }

  const isBinaryFile = data instanceof Buffer;

  isParsing = true;

  const globalData = new GlobalData(options || {});
  let info;
  let chunks;
  let events = [];

  if (globalData.debug) {
    if (fs.existsSync('netfieldexports.txt')) {
      fs.unlinkSync('netfieldexports.txt');
    }

    if (fs.existsSync('netGuidToPathName.txt')) {
      fs.unlinkSync('netGuidToPathName.txt');
    }
  }

  globalData.additionalStates.forEach((stateName) => {
    globalData.states[stateName] = {};
  });

  globalData.handleEventEmitter({
    propertyExportEmitter: globalData.exportEmitter,
    actorDespawnEmitter: globalData.actorDespawnEmitter,
    netDeltaReadEmitter: globalData.netDeltaEmitter,
    parsingEmitter: globalData.parsingEmitter,
  });

  try {
    if (isBinaryFile) {
      const replay = new Replay(data);

      info = replayInfo(replay,  globalData);
      chunks = replayChunks(replay, globalData);
      events = await parseChunks(replay, chunks, globalData);
    } else {
      if (!verifyMetadata(data)) {
        throw new Error('The data provided is neither a Buffer or a valid metadata file')
      }

      info = replayInfoStreaming(data, globalData);
      chunks = await replayChunksStreaming(data, globalData);
      events = await parseChunksStreaming(chunks, globalData);
    }
  } catch (err) {
    isParsing = false;

    throw err;
  }

  if (globalData.debug) {
    Object.values(globalData.netGuidCache.NetFieldExportGroupMap).forEach((value) => {
      const filteredNetFieldExports = value.netFieldExports.filter((a) => a && a.name !== 'RemoteRole' && a.name !== 'Role');

      if (!filteredNetFieldExports.length) {
        return;
      }

      fs.appendFileSync('netfieldexports.txt', value.pathName + '\n');

      filteredNetFieldExports.forEach((exportt) => {
        fs.appendFileSync('netfieldexports.txt', '  ' + exportt.name + '\n');
      });
    });

    fs.writeFileSync('netGuidToPathName.txt', globalData.debugNetGuidToPathName.map(({ key, val }) => `${key}: ${val}`).join('\n'));
    fs.writeFileSync('notReadingGroups.txt', Object.values(globalData.debugNotReadingGroups).map(({ pathName, properties }) => `${pathName}:\n${Object.values(properties).map(({ name, handle }) => `  ${name}: ${handle}`).join('\n')}`).join('\n\n'))
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

module.exports = parse;
