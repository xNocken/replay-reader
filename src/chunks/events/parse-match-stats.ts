import { MatchStatsEventExport } from '../../../types/events';
import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';

export const parseMatchStats = (globalData: GlobalData, replay: Replay) => {
  const accuracy = replay.readFloat32();
  const assists = replay.readUInt32();
  const eliminations = replay.readUInt32();
  const weaponDamage = replay.readUInt32();
  const otherDamage = replay.readUInt32();
  const revives = replay.readUInt32();
  const damageTaken = replay.readUInt32();
  const damageToStructures = replay.readUInt32();
  const materialsGathered = replay.readUInt32();
  const materialsUsed = replay.readUInt32();
  const totalTraveled = replay.readUInt32();

  const matchStats: MatchStatsEventExport = {
    accuracy,
    assists,
    eliminations,
    weaponDamage,
    otherDamage,
    revives,
    damageTaken,
    damageToStructures,
    materialsGathered,
    materialsUsed,
    totalTraveled,
    damageToPlayers: weaponDamage + otherDamage,
  }

  if (!globalData.eventData.matchStats) {
    globalData.eventData.matchStats = {
      ...matchStats,
      placement: null,
      totalPlayers: null,
    };
  } else {
    globalData.eventData.matchStats = {
      ...globalData.eventData.matchStats,
      ...matchStats,
    };
  }
}
