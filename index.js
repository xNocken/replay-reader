const Replay = require('./src/Classes/Replay');
const { replayInfo, replayChunks } = require('./src/parse');
const globalData = require('./src/utils/globalData');

const parse = async (buffer) => {
  const replay = new Replay(buffer);

  const info = await replayInfo(replay);
  const chunks = await replayChunks(replay);

  globalData.result.players = Object.values(globalData.players);
  globalData.result.mapData.pickups = Object.values(globalData.pickups);

  return {
    info,
    chunks,
    ...globalData.result,
  };
}

module.exports = parse;
