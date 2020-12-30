const fs = require('fs');
const parse = require('.');

fs.writeFileSync('replay.json', JSON.stringify(parse(fs.readFileSync('1.replay')), null, 2));
