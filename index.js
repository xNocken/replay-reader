const Replay = require('./src/Classes/Replay');
const { replayInfo, replayChunks } = require('./src/parse');
const GlobalData = require('./src/utils/globalData');
const fs = require('fs');
let isParsing = false;

const parse = async (buffer, options) => {
  if (isParsing) {
    throw Error('Cannot parse multiple replays at once');
  }

  isParsing = true;

  const replay = new Replay(buffer);

  const globalData = new GlobalData(options || {});
  let info;
  let chunks;

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
    info = replayInfo(replay);
    chunks = await replayChunks(replay, globalData);
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
  }

  isParsing = false;

  return {
    header: globalData.header,
    info,
    events: chunks,
    ...globalData.result,
  };
}

module.exports = parse;
