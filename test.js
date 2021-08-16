const fs = require('fs');
const parse = require('.');

(async() => {
  const replayBuffer = fs.readFileSync('replays/server-17.21.replay');

  console.time();
   const parsedReplay = await parse(replayBuffer, {
    parseLevel: 10,
    // netFieldExportPath: 'NetFieldExports',
    // onlyUseCustomNetFieldExports: true,
    // customClassPath: 'Classes',
    // onChannelOpened: console.log,
    // onChannelClosed: console.log,
    // debug: true,
  });
  console.timeEnd();

  fs.writeFileSync('replay.json', JSON.stringify(parsedReplay, null, 2));
})()
