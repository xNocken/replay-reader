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
2. (optional) A [config](./settings.md) that allows you to customize some things (e.g. `parseLevel`).

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
You (very) often don't need all of the data that is parsed, which is why there is an option that lets you specify which data you want to parse. It will also greatly improve the parser's speed. The tutorial on how to do that is [here](./addOwnExports.md).

## Tip
If you're using Node v14 or v15 you have to start process with ```--experimental-wasm-simd```
