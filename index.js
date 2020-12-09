const { writeFileSync } = require('fs');
const Replay = require('./src/Classes/Replay');
const { replayInfo, replayChunks } = require('./src/parse');

const parse = (buffer) => {
  const replay = new Replay(buffer);

  const info = replayInfo(replay);
  const chunks = replayChunks(replay);

  writeFileSync('replay.json', JSON.stringify({
    info,
    ...chunks,
  }, null, 2))
}

module.exports = parse;
