import fs from 'fs';

import { DefaultResult } from '$types/result-data';
import { parseBinary, parseStreaming } from './index';

const parseReplay = () => {
  const replayBuffer = fs.readFileSync('Bars reset.replay');

  console.time();
  const parsedReplay = parseBinary<DefaultResult>(replayBuffer, {
    parseLevel: 10,
    // customNetFieldExports: [
    //   require('./NetFieldExports/SafeZoneIndicator.json'),
    // ],
    // onlyUseCustomNetFieldExports: true,
    debug: true,
    useCheckpoints: false,
  });

  console.timeEnd();

  fs.writeFileSync('replay.json', JSON.stringify(parsedReplay, (__, a) => typeof a === 'bigint' ? parseInt(a.toString(), 10) : a, 2));
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
