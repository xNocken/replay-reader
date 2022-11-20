import { TeamStatsEventExport } from '../../../types/events';
import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';

export const parseTeamStats = (globalData: GlobalData, replay: Replay) => {
  const placement = replay.readUInt32();
  const totalPlayers = replay.readUInt32();

  const matchStats: TeamStatsEventExport = {
    placement,
    totalPlayers,
  }

  if (!globalData.eventData.matchStats) {
    globalData.eventData.matchStats = {
      ...matchStats,
      accuracy: null,
      assists: null,
      eliminations: null,
      weaponDamage: null,
      otherDamage: null,
      revives: null,
      damageTaken: null,
      damageToStructures: null,
      materialsGathered: null,
      materialsUsed: null,
      totalTraveled: null,
      damageToPlayers: null,
    };
  } else {
    globalData.eventData.matchStats = {
      ...globalData.eventData.matchStats,
      ...matchStats,
    };
  }
}
