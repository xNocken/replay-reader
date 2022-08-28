import { BaseResult, BaseStates, Event } from '$types/lib';
import GlobalData from '../Classes/GlobalData';
import Replay from '../Classes/Replay';
import { parseMatchStats } from './events/parse-match-stats';
import { parseTeamStats } from './events/parse-team-stats';
import { parsePlayerElim } from './events/parse-player-elim';
import { parseZoneUpdate } from './events/parse-zone-update';
import { parseCharacterSampleMeta } from './events/parse-character-sample-meta';
import { parseTimecode } from './events/parse-timecode';
import { actorPositions } from './events/parse-actor-positions';
import { parseAdditionGFP } from './events/parse-addition-gfp';

const event = <ResultType extends BaseResult>(replay: Replay, info: Event, globalData: GlobalData<ResultType>) => {
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

  switch (info.group) {
    case 'AthenaReplayBrowserEvents':
      if (info.metadata === 'AthenaMatchStats') {
        parseMatchStats(globalData, decryptedEvent);
      } else if (info.metadata === 'AthenaMatchTeamStats') {
        parseTeamStats(globalData, decryptedEvent);
      }

      break;

    case 'playerElim':
      parsePlayerElim(globalData, decryptedEvent, startTime);

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
      parseAdditionGFP(globalData, decryptedEvent);

      break;
  }

  if (!replayMeta.isEncrypted) {
    replay.popOffset(1, info.chunkSize * 8);
  }
};

export default event;
