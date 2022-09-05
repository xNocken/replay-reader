import fs from 'fs';

import { DefaultResult } from './types/result-data';
import { parseBinary, parseStreaming } from './index';

const parseReplay = () => {
  const replayBuffer = fs.readFileSync('wtf.replay');

  console.time();
  const parsedReplay = parseBinary<DefaultResult>(replayBuffer, {
    parseLevel: 10,
    // customNetFieldExports: [
    //   require('./NetFieldExports/SafeZoneIndicator.json'),
    // ],
    // onlyUseCustomNetFieldExports: true,
    debug: true,
    enableActorToPath: false,
    useCheckpoints: false,
  });

  console.timeEnd();

  fs.writeFileSync('replay.json', JSON.stringify(parsedReplay, (__, a) => typeof a === 'bigint' ? parseInt(a.toString(), 10) : a, 2));
}

const parseMetadata = async () => {
  const replayBuffer = JSON.parse(fs.readFileSync('metadata.json', 'utf-8'));

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

const benchmark = () => {
  const replayBuffer = fs.readFileSync('replays/21.30-server.replay');
  let totalTime = 0;
  let runs = 0;

  while (true) {
    const startTime = Date.now();
    const parsedReplay = parseBinary<DefaultResult>(replayBuffer, {
      parseLevel: 10,
      // customNetFieldExports: [
      //   require('./NetFieldExports/SafeZoneIndicator.json'),
      // ],
      // onlyUseCustomNetFieldExports: true,
      debug: false,
      enableActorToPath: false,
      useCheckpoints: false,
    });

    const time = Date.now() - startTime;
    totalTime += time;
    runs++;

    console.log(`Avg run takes ${totalTime / runs}ms in ${runs} runs`);
  }
};

parseReplay()
