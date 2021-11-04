# Streaming
Streaming can be used if the replays to be parsed are tournament replays. The advantage of streaming is that only the chunks that are needed are downloaded. 

All you need for streaming is a replay metadata from the libary [fortnite-replay-downloader](https://www.npmjs.com/package/fortnite-replay-downloader)

## Advantages
- Only downloads required chunks
- Downloads chunks on demand
- No need to download a replay using the replay downloader and parse it again
- If additional chunks are required you only need to change it in the parser config

## Requirements
- [fortnite-replay-downloader](https://www.npmjs.com/package/fortnite-replay-downloader)

## Example
```js
// more info about this function can be found in the documentation for the replay downloader
const metadata = await replayDownloader.downloadMetadata({ 
  matchId: '09525a55bf724b54b6cae5921f80dcba',
  chunkDownloadLinks: true, // this is important
  deviceAuth,
});

const replay = await parser(metadata, {
  parseEvents: false, // only download dataChunks
});
```
