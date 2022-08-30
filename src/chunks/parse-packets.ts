import { DataChunk } from '$types/lib';
import GlobalData from '../Classes/GlobalData';
import Replay from '../Classes/Replay';
import { decompress } from '../utils/decompress';
import { parsePlaybackPackets } from './packets/parse-playback-packets';

export const parsePackets = (encryptedReplay: Replay, data: DataChunk, globalData: GlobalData) => {
  encryptedReplay.goTo(data.startPos);
  let compressedReplay: Replay;

  if (globalData.meta.isEncrypted) {
    compressedReplay = encryptedReplay.decryptBuffer(data.chunkSize, globalData.meta.encryptionKey);
  } else {
    compressedReplay = encryptedReplay;

    encryptedReplay.addOffsetByte(1, data.chunkSize);
  }

  let replay: Replay;

  if (globalData.meta.isCompressed) {
    replay = decompress(compressedReplay, globalData);
  } else {
    replay = compressedReplay;
  }

  while (!replay.atEnd()) {
    parsePlaybackPackets(replay, globalData);
  }

  if (!globalData.meta.isEncrypted) {
    encryptedReplay.popOffset(1, data.chunkSize * 8);
  };
};
