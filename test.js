const fs = require('fs');
const parse = require('.');

(async() => {
  console.time();
  fs.writeFileSync('replay.json', JSON.stringify(await parse(fs.readFileSync('replays/speedsigntest.replay'), {
    parseLevel: 10,
    // netFieldExportPath: 'NetFieldExports',
    // onlyUseCustomNetFieldExports: true,
    // customClassPath: 'Classes',
    // onChannelOpened: console.log,
    // onChannelClosed: console.log,
    debug: true,
  }), null, 2));
  console.timeEnd();
})()
