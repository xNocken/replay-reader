const fs = require('fs');
const parse = require('.');

(async() => {
  fs.writeFileSync('replay.json', JSON.stringify(await parse(fs.readFileSync('replays/travis-rift.replay')), null, 2));
})()
