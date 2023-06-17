import { Checkpoint } from '../../types/lib';
import GlobalData from '../Classes/GlobalData';
import Replay from '../Classes/Replay';

import { readNetFieldExportGroup } from './checkpoints/read-net-field-export-group';
import { decompress } from '../utils/decompress';
import { parsePlaybackPackets } from './packets/parse-playback-packets';
import { removePathPrefix } from '../utils/remove-path-prefix';
import { NetworkGUID } from '../../Classes/NetworkGUID';
import EReplayCustomVersion from '../versions/EReplayCustomVersion';

export const parseCheckpoint = (encryptedReplay: Replay, data: Checkpoint, globalData: GlobalData) => {
  encryptedReplay.goTo(data.startPos);

  globalData.resetForCheckpoint();

  let decryptedReplay: Replay;

  if (globalData.meta.isEncrypted) {
    decryptedReplay = encryptedReplay.decryptBuffer(data.chunkSize, globalData.meta.encryptionKey);
  } else {
    decryptedReplay = encryptedReplay;
    encryptedReplay.addOffsetByte(1, data.chunkSize);
  }

  let replay: Replay;

  if (globalData.meta.isCompressed) {
    replay = decompress(decryptedReplay, globalData);
  } else {
    replay = decryptedReplay;
  }

  if (replay.hasDeltaCheckpoints()) {
    replay.skipBytes(4); // checkpoint size
  }

  if (replay.hasLevelStreamingFixes()) {
    replay.skipBytes(8); // packet offset
  }

  if (globalData.customVersion.getNetworkVersion() >= EReplayCustomVersion.MultipleLevels) {
    replay.skipBytes(4); // level for checkpoint
  }

  if (globalData.customVersion.getNetworkVersion() >= EReplayCustomVersion.DeletedStartupActors) {
    if (replay.hasDeltaCheckpoints()) {
      throw new Error('delta checkpoints not implemented');
    }

    replay.readArray((replay) => replay.readString());
  }

  const guidCount = replay.readInt32();

  const cacheGuids: NetworkGUID[] = [];

  for (let i = 0; i < guidCount; i++) {
    const guid = replay.readIntPacked();
    const outerId = replay.readIntPacked();
    const cacheObject = new NetworkGUID(guid);
    let outerGuid = new NetworkGUID(outerId);

    if (outerId !== 0) {
      outerGuid = cacheGuids.find((guid) => guid && guid.value === outerId) || outerGuid;

      cacheObject.outer = outerGuid;
    }

    if (globalData.customVersion.getNetworkVersion() < EReplayCustomVersion.GuidNameTable) {
      cacheObject.path = removePathPrefix(replay.readString());
    } else {
      const isExported = replay.readByte() === 1;

      if (isExported) {
        cacheObject.path = removePathPrefix(replay.readString());

        cacheGuids.push(cacheObject);
      } else {
        const pathNameIndex = replay.readIntPacked();

        if (pathNameIndex < cacheGuids.length) {
          cacheObject.path = cacheGuids[pathNameIndex].path;
        }
      }
    }

    if (globalData.customVersion.getNetworkVersion() < EReplayCustomVersion.GuidCacheChecksums) {
      cacheObject.checksum = replay.readUInt32();
    }

    cacheObject.flags = replay.readByte();

    globalData.netGuidCache.netGuids[guid] = cacheObject;

    if (globalData.options.debug) {
      globalData.debugNetGuidToPathName.push(cacheObject);
    }
  }

  const groups = [];

  if (replay.hasDeltaCheckpoints()) {
    throw new Error('Delta checkpoints not implemented');
  } else {
    const netFieldExportCount = replay.readInt32();

    for (let i = 0; i < netFieldExportCount; i++) {
      groups.push(readNetFieldExportGroup(replay, globalData));
    }
  }

  parsePlaybackPackets(replay, globalData);

  if (!globalData.meta.isEncrypted) {
    encryptedReplay.popOffset(1);
  }
};