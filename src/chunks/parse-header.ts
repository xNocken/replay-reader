import { BuildTargetType } from '../../Enums/BuildTargetType';
import { CustomEnum, Header, ReadObjectResult } from '../../types/lib';
import { Logger } from '../Classes/Logger';
import Replay from '../Classes/Replay';
import versions from '../constants/versions';

const headerMagic = 0x2CF5A13D;

const header = (replay: Replay, logger: Logger): Header => {
  const magic = replay.readUInt32();

  if (magic !== headerMagic) {
    throw new Error('header magic invalid');
  }

  const networkVersion = replay.readUInt32();
  const networkChecksum = replay.readUInt32();
  const engineNetworkVersion = replay.readUInt32();
  const gameNetworkProtocolVersion = replay.readUInt32();
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

  if (networkVersion > versions.networkVersion) {
    logger.warn('This replay has a higher network version than currently supported. parsing may fail');
  }

  if (engineNetworkVersion > versions.engineNetworkVersion) {
    logger.warn('This replay has a higher engine network version than currently supported. parsing may fail');
  }

  if (networkVersion >= 12) {
    guid = replay.readId();
  }

  if (networkVersion >= 11) {
    replay.skipBytes(4);
    patch = replay.readUInt16();
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

  if (networkVersion >= 18) {
    fileVersionUE4 = replay.readUInt32();
    fileVersionUE5 = replay.readUInt32();
    packageVersionLicenseeUe = replay.readUInt32();
  }

  if (networkVersion <= 6) {
    throw Error('Not implented');
  } else {
    levelNamesAndTimes = replay.readObject((replay) => replay.readString(), (replay) => replay.readUInt32());
  }

  if (networkVersion >= 9) {
    flags = replay.readUInt32();
  }

  const gameSpecificDataAmount = replay.readUInt32();
  const gameSpecificData = [];

  for (let i = 0; i < gameSpecificDataAmount; i++) {
    gameSpecificData.push(replay.readString());
  }

  if (engineNetworkVersion === 9) {
    throw new Error('Replays with engineNetworkVersion 9 are not supported');
  }

  if (networkVersion >= 17) {
    minRecordHz = replay.readFloat32();
    maxRecordHz = replay.readFloat32();
    frameLimitInMS = replay.readFloat32();
    checkpointLimitInMS = replay.readFloat32();

    platform = replay.readString();

    buildConfig = replay.readByte();
    buildTargetType = BuildTargetType[replay.readByte()];
  }

  const result: Header = {
    networkVersion,
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
