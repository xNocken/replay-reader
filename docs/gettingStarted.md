# Getting started

## Install

```shell
npm i fortnite-replay-parser
```
or
```shell
yarn add fortnite-replay-parser
```

## Write your first code
The only function required is the parse function. It takes in a Buffer from the array and a optional config and returns a promise.

```js
const fs = require('fs');
const replayParser = require('fortnite-replay-parser');
const replayBuffer = fs.readFileSync('my.replay');

replayParser(replayBuffer).then((parsedReplay) => {
  fs.writeFileSync('myReplay.json', JSON.stringify(parsedReplay));
}).catch((err) => {
  console.error('An error occured while parsing the replay', err);
});
```

## Starting Node
If you're using node version 14 or 15 you need to start the process with ```--experimental-wasm-simd```

## Optimizing runtime
Im pretty sure that not all data parsed is really required. And parsing the properties makes up about half of the runtime. Thats why its possible to only parse what you really need. How to create your own exports can be found [here](./addOwnExports.md)
