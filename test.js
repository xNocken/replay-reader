const { ok } = require('assert');
const fs = require('fs');
const parse = require('.');

(async() => {
  console.time();
  fs.writeFileSync('replay.json', JSON.stringify(await parse(fs.readFileSync('replays/chesttest.replay'), {
  // fs.writeFileSync('replay.json', JSON.stringify(await parse(fs.readFileSync('../replay-builder/result.replay'), {
    parseLevel: 10,
    // netFieldExportPath: 'NetFieldExports',
    // onlyUseCustomNetFieldExports: true,
    // customClassPath: 'Classes',
    // onChannelOpened: console.log,
    // onChannelClosed: console.log,
    debug: true,
    rebuildMode: false,
  }), null, 2));
  console.log('replay one successfully parsed')
  console.timeEnd();
})().catch((r) => {
  console.log(r.stack);
})
