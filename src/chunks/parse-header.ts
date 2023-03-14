import { Header, ReadObjectResult } from '../../types/lib';
import GlobalData from '../Classes/GlobalData';
import { Logger } from '../Classes/Logger';
import Replay from '../Classes/Replay';
import EEngineNetworkCustomVersion from '../versions/EEngineNetworkCustomVersion';
import EReplayCustomVersion from '../versions/EReplayCustomVersion';

const headerMagic = 0x2CF5A13D;

const header = (replay: Replay, logger: Logger, globalData: GlobalData): Header => {
  const BuildTargetType = globalData.netFieldParser.getEnum('BuildTargetType');
  const magic = replay.readUInt32();

  if (magic !== headerMagic) {
    throw new Error('header magic invalid');
  }

  const replayVersion = replay.readUInt32();

  if (replayVersion >= EReplayCustomVersion.CustomVersions) {
    globalData.customVersion.serialize(replay);
  }

  const networkChecksum = replay.readUInt32();
  const engineNetworkVersion = replay.readUInt32();
  const gameNetworkProtocolVersion = replay.readUInt32();

  if (replayVersion < EReplayCustomVersion.CustomVersions) {
    globalData.customVersion.setNetworkVersion(replayVersion);
    globalData.customVersion.setEngineNetworkVersion(engineNetworkVersion);
    globalData.customVersion.setGameNetworkVersion(gameNetworkProtocolVersion);
  }

  let levelNamesAndTimes: ReadObjectResult<number>;
  let guid: string;
  let minor: number;
  let changelist: number;
  let branch: string;
  let major: number;
  let patch: number;
  let flags: number;
  let fileVersionUE4: number;
  let fileVersionUE5: number;
  let packageVersionLicenseeUe: number;
  let minRecordHz: number;
  let maxRecordHz: number;
  let frameLimitInMS: number;
  let checkpointLimitInMS: number;
  let platform: string;
  let buildConfig: number;
  let buildTargetType: string;

  if (replayVersion > EReplayCustomVersion.LatestVersion) {
    logger.warn('This replay has a higher network version than currently supported. parsing may fail');
  }

  if (engineNetworkVersion > EEngineNetworkCustomVersion.LatestVersion) {
    logger.warn('This replay has a higher engine network version than currently supported. parsing may fail');
  }

  if (replayVersion >= EReplayCustomVersion.HeaderGuid) {
    guid = replay.readId();
  }

  if (replayVersion >= EReplayCustomVersion.SaveFullEngineVersion) {
    // engine version major, minor, patch
    replay.skipBytes(6);

    changelist = replay.readUInt32();
    branch = replay.readString();

    const regex = branch.match(/\+\+Fortnite\+Release-(?<major>\d+)\.(?<minor>\d*)/);

    if (regex) {
      major = parseInt(regex.groups.major, 10);
      minor = parseInt(regex.groups.minor, 10);
    }
  } else {
    changelist = replay.readUInt32();
  }

  // should be SavePackageVersionUE but fortnite reversed it
  if (replayVersion >= EReplayCustomVersion.RecordingMetadata) {
    fileVersionUE4 = replay.readUInt32();
    fileVersionUE5 = replay.readUInt32();
    packageVersionLicenseeUe = replay.readUInt32();
  }

  if (replayVersion <= EReplayCustomVersion.MultipleLevels) {
    throw Error('Not implented');
  } else {
    levelNamesAndTimes = replay.readObject((replay) => replay.readString(), (replay) => replay.readUInt32());
  }

  if (replayVersion >= EReplayCustomVersion.HeaderFlags) {
    flags = replay.readUInt32();
  }

  const gameSpecificDataAmount = replay.readUInt32();
  const gameSpecificData = [];

  for (let i = 0; i < gameSpecificDataAmount; i++) {
    gameSpecificData.push(replay.readString());
  }

  // env 9 seems to have had a bug that caused the nfe name to not be stored at all. makes parsing it almost impossible
  if (engineNetworkVersion === EEngineNetworkCustomVersion.NetExportSerialization) {
    throw new Error('Replays with engineNetworkVersion 9 are not supported');
  }

  // should be RecordingMetadata but fortnite reversed it
  if (replayVersion >= EReplayCustomVersion.SavePackageVersionUE) {
    minRecordHz = replay.readFloat32();
    maxRecordHz = replay.readFloat32();
    frameLimitInMS = replay.readFloat32();
    checkpointLimitInMS = replay.readFloat32();

    platform = replay.readString();

    buildConfig = replay.readByte();
    buildTargetType = BuildTargetType[replay.readByte()];
  }

  const result: Header = {
    networkVersion: replayVersion,
    networkChecksum,
    engineNetworkVersion,
    gameNetworkProtocolVersion,
    levelNamesAndTimes,
    guid,
    minor,
    changelist,
    branch,
    major,
    patch,
    flags,
    fileVersionUE4,
    fileVersionUE5,
    packageVersionLicenseeUe,
    minRecordHz,
    maxRecordHz,
    frameLimitInMS,
    platform,
    checkpointLimitInMS,
    buildConfig,
    buildTargetType,
  };

  replay.header = result;

  return result;
};

export default header;
