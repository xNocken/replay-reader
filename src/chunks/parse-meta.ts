import { Meta } from '../../types/lib';
import GlobalData from '../Classes/GlobalData';
import Replay from '../Classes/Replay';
import ELocalFileReplayCustomVersion from '../versions/ELocalFileReplayCustomVersion';

const metaMagic = 0x1CA2E27F;

export const parseMeta = (replay: Replay, globalData: GlobalData): Meta => {
  const magic = replay.readUInt32();

  if (magic !== metaMagic) {
    throw new Error('Not a valid replay');
  }

  const fileVersion = replay.readUInt32();

  if (fileVersion >= ELocalFileReplayCustomVersion.CustomVersions) {
    globalData.customVersion.serialize(replay);
  } else {
    globalData.customVersion.setLocalFileReplayVersion(fileVersion);
  }

  const lengthInMs = replay.readUInt32();
  const networkVersion = replay.readUInt32();
  const changelist = replay.readUInt32();
  const friendlyName = replay.readString();
  const isLive = replay.readBoolean();
  let timestamp: Date;
  let isCompressed: boolean;
  let isEncrypted: boolean;
  let encryptionKey: Buffer;

  if (fileVersion > ELocalFileReplayCustomVersion.LatestVersion) {
    globalData.logger.warn(`File version ${fileVersion} is newer than the latest supported version ${ELocalFileReplayCustomVersion.LatestVersion}. Parsing may fail`);
  }

  if (fileVersion >= ELocalFileReplayCustomVersion.RecordingTimestamp) {
    timestamp = replay.readDate();
  }

  if (fileVersion >= ELocalFileReplayCustomVersion.CompressionSupport) {
    isCompressed = replay.readBoolean();
  }

  if (fileVersion >= ELocalFileReplayCustomVersion.EncryptionSupport) {
    isEncrypted = replay.readBoolean();
    encryptionKey = Buffer.from(replay.readBytes(replay.readUInt32()));
  }

  if (!isLive && isEncrypted && encryptionKey.length === 0) {
    throw Error('Replay encrypted but no key was found!');
  }

  if (isLive && isEncrypted) {
    throw Error('Replay encrypted but not completed');
  }

  const meta: Meta = {
    fileVersion,
    lengthInMs,
    networkVersion,
    changelist,
    friendlyName,
    isLive,
    timestamp,
    isCompressed,
    isEncrypted,
    encryptionKey,
  };

  globalData.meta = meta;

  return meta;
};
