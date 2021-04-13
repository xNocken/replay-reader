const fs = require('fs');
const parse = require('.');

const onRead = () => {
 console;
};

(async() => {
  console.time();
  fs.writeFileSync('replay.json', JSON.stringify(await parse(fs.readFileSync('replays/server big.replay'), {
    parseLevel: 10,
    // netFieldExportPath: 'NetFieldExports',
    // onlyUseCustomNetFieldExports: false,
    // customClassPath: 'Classes',
    debug: true,
  }), null, 2));
  console.timeEnd();
})()
