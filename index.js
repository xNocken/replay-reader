const Replay = require('./src/Classes/Replay');
const { replayInfo, replayChunks } = require('./src/parse');
const GlobalData = require('./src/utils/globalData');
const fs = require('fs');
const netGuidCache = require('./src/utils/netGuidCache');

const parse = async (buffer, options) => {
  const replay = new Replay(buffer);

  const globalData = new GlobalData(options || {});

  if (globalData.debug) {
    if (fs.existsSync('notReadingGroups.txt')) {
      fs.unlinkSync('notReadingGroups.txt');
    }

    if (fs.existsSync('netfieldexports.txt')) {
      fs.unlinkSync('netfieldexports.txt');
    }

    if (fs.existsSync('netGuidToPathName.txt')) {
      fs.unlinkSync('netGuidToPathName.txt');
    }
  }

  const info = replayInfo(replay);
  const chunks = await replayChunks(replay, globalData);

  globalData.result.players = Object.values(globalData.players);
  globalData.result.mapData.pickups = Object.values(globalData.pickups);
  globalData.result.mapData.llamas = Object.values(globalData.llamas);
  globalData.result.mapData.labradorLlamas = Object.values(globalData.labradorLlamas);

  if (globalData.debug) {
    Object.values(netGuidCache.NetFieldExportGroupMap).forEach((value) => {
      const filteredNetFieldExports = value.netFieldExports.filter((a) => a && a.name !== 'RemoteRole' && a.name !== 'Role');

      if (!filteredNetFieldExports.length) {
        return;
      }

      fs.appendFileSync('netfieldexports.txt', value.pathName + '\n');

      filteredNetFieldExports.forEach((exportt) => {
        fs.appendFileSync('netfieldexports.txt', '  ' + exportt.name + '\n');
      });
    });

    fs.writeFileSync('netGuidToPathName.txt', Object.entries(netGuidCache.NetGuidToPathName).map(([a, b]) => `${a}: ${b}`).join('\n'));
  }

  return {
    header: globalData.header,
    info,
    events: chunks,
    ...globalData.result,
  };
}

module.exports = parse;
