const Replay = require('./src/Classes/Replay');
const { replayInfo, replayChunks } = require('./src/parse');

const parse = (buffer) => {
  const replay = new Replay(buffer);

  const info = replayInfo(replay);
  const chunks = replayChunks(replay);

  return {
    info,
    chunks,
  };
}

module.exports = parse;
