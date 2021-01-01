const Replay = require('./src/Classes/Replay');
const { replayInfo, replayChunks } = require('./src/parse');

const parse = async (buffer) => {
  const replay = new Replay(buffer);

  const info = await replayInfo(replay);
  const chunks = replayChunks(replay);

  return {
    info,
    chunks,
  };
}

module.exports = parse;
