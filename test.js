const fs = require('fs');
const parse = require('.');

parse(fs.readFileSync('1.replay'));
