const fs = require('fs');
const parse = require('.');

(async() => {
  fs.writeFileSync('replay.json', JSON.stringify(await parse(fs.readFileSync('1.replay')), null, 2));
})()
