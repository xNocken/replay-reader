const fs = require('fs');
const { parse, parseStreaming } = require('./index.js');

const parseReplay = () => {
  const replayBuffer = fs.readFileSync('replays/20.20-server.replay');

  console.time();
  const parsedReplay = parse(replayBuffer, {
    parseLevel: 10,
    // customNetFieldExports: [
    //   require('./NetFieldExports/SafeZoneIndicator.json'),
    // ],
    // onlyUseCustomNetFieldExports: true,
    debug: true,
    useCheckpoints: false,
  });
  console.timeEnd();

  fs.writeFileSync('replay.json', JSON.stringify(parsedReplay, null, 2));
}

const parseMetadata = async () => {
  const replayBuffer = require('../replay-downloader/metadata.json');

  console.time();
  const parsedReplay = await parseStreaming(replayBuffer, {
    parseLevel: 10,
    // customNetFieldExports: [
    //   require('./NetFieldExports/SafeZoneIndicator.json'),
    // ],
    // onlyUseCustomNetFieldExports: true,
    debug: true,
    useCheckpoints: false,
  });
  console.timeEnd();

  fs.writeFileSync('replay.json', JSON.stringify(parsedReplay, null, 2));
}

parseReplay()
