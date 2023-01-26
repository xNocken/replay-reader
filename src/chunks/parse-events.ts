import versions from '../constants/versions';

import { actorPositions } from './events/parse-actor-positions';
import { parseAdditionGFP } from './events/parse-addition-gfp';
import { parseCharacterSampleMeta } from './events/parse-character-sample-meta';
import { parseMatchStats } from './events/parse-match-stats';
import { parsePlayerElim } from './events/parse-player-elim';
import { parsePlayerEncryptionKey } from './events/parse-player-encryption-key';
import { parseTeamStats } from './events/parse-team-stats';
import { parseTimecode } from './events/parse-timecode';
import { parseZoneUpdate } from './events/parse-zone-update';

import type { Event } from '../../types/lib';
import type GlobalData from '../Classes/GlobalData';
import type Replay from '../Classes/Replay';

const event = (replay: Replay, info: Event, globalData: GlobalData) => {
  const startTime = Math.round(info.startTime / 1000);
  const replayMeta = globalData.meta;
  let decryptedEvent: Replay;

  replay.goTo(info.startPos);

  if (replayMeta.isEncrypted) {
    decryptedEvent = replay.decryptBuffer(info.chunkSize, replayMeta.encryptionKey);
  } else {
    decryptedEvent = replay;

    replay.addOffsetByte(1, info.chunkSize);
  }

  const highestVersion = versions[<keyof typeof versions>info.group];

  let version = 0;

  if (highestVersion !== -1) {
    version = decryptedEvent.readInt32();

    if (highestVersion === undefined || version > highestVersion) {
      globalData.logger.warn(`Event ${info.group} has an unknown version. supported: ${highestVersion} found: ${version}.`);
    }
  }

  switch (info.group) {
    case 'AthenaReplayBrowserEvents':
      if (info.metadata === 'AthenaMatchStats') {
        parseMatchStats(globalData, decryptedEvent);
      } else if (info.metadata === 'AthenaMatchTeamStats') {
        parseTeamStats(globalData, decryptedEvent);
      }

      break;

    case 'playerElim':
      parsePlayerElim(globalData, decryptedEvent, startTime, version);

      break;

    case 'ZoneUpdate':
      parseZoneUpdate(globalData, decryptedEvent);

      break;

    case 'CharacterSample':
      parseCharacterSampleMeta(globalData, decryptedEvent);

      break;

    case 'Timecode':
      parseTimecode(globalData, decryptedEvent);

      break;

    case 'ActorsPosition':
      actorPositions(globalData, decryptedEvent);

      break;

    case 'AdditionGFPEventGroup':
      parseAdditionGFP(globalData, decryptedEvent, version);

      break;

    case 'PlayerStateEncryptionKey':
      parsePlayerEncryptionKey(globalData, decryptedEvent);

      break;

    default:
      globalData.logger.warn(`Unknown event group: ${info.group}`);
      break;
  }

  if (!replayMeta.isEncrypted) {
    replay.popOffset(1, info.chunkSize * 8);
  }
};

export default event;
