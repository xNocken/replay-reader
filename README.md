# Fortnite Replay Parser
[![npm version](https://badge.fury.io/js/fortnite-replay-parser.svg)](https://npmjs.com/package/fortnite-replay-parser)

The only libary that can parse 100% of fortnite replays.

## Documentation

- [Settings](./docs/settings.md)
- [Add own Exports](./docs/addOwnExports.md)
- [Streaming](./docs/streaming.md)
- [Example project](https://github.com/xNocken/replay-reader-demo-project)

## Prerequisites

  * [Node 14+](https://nodejs.org/)

## Installation

```shell
npm i fortnite-replay-parser  
```
or
```shell
yarn add fortnite-replay-parser
```

## Code Example
Writing code with this library is pretty straight-forward as there is only one function.

The function takes two arguments:
1. The buffer of the replay file, which can easily be obtained by using [fs](https://nodejs.org/api/fs.html).
2. (optional) A [config](./docs/settings.md) that allows you to customize some things (e.g. `parseLevel`).

```js
const fs = require('fs');
const parseReplay = require('fortnite-replay-parser');
const replayBuffer = fs.readFileSync('your.replay');

const config = {
  parseLevel: 10,
  debug: true,
}

parseReplay(replayBuffer, config).then((parsedReplay) => {
  fs.writeFileSync('replayData.json', JSON.stringify(parsedReplay));
}).catch((err) => {
  console.error('An error occured while parsing the replay!', err);
});
```

## Optimizing Runtime
You (very) often don't need all of the data that is parsed, which is why there is an option that lets you specify which data you want to parse. It will also greatly improve the parser's speed. The tutorial on how to do that is [here](./docs/addOwnExports.md).

## Tip
If you're using Node v14 or v15 you have to start process with ```--experimental-wasm-simd```
