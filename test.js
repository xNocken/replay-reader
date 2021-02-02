const fs = require('fs');
const parse = require('.');

(async() => {
  fs.writeFileSync('replay.json', JSON.stringify(await parse(fs.readFileSync('result.replay')), null, 2));
})()
