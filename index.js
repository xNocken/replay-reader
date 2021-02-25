const Replay = require('./src/Classes/Replay');
const { replayInfo, replayChunks } = require('./src/parse');
const GlobalData = require('./src/utils/globalData');

const parse = async (buffer, options) => {
  const replay = new Replay(buffer);

  const globalData = new GlobalData(options || {});

  const info = replayInfo(replay);
  const chunks = await replayChunks(replay, globalData);

  globalData.result.players = Object.values(globalData.players);
  globalData.result.mapData.pickups = Object.values(globalData.pickups);

  return {
    info,
    chunks,
    ...globalData.result,
  };
}

module.exports = parse;
