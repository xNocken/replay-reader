import { BaseResult, BaseStates, MatchStatsEvent } from '$types/lib';
import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';

export const parseMatchStats = <ResultType extends BaseResult>(globalData: GlobalData<ResultType>, replay: Replay) => {
  const version = replay.readInt32();

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

  const matchStats: MatchStatsEvent = {
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
    placement: null,
    totalPlayers: null,
  }

  globalData.eventData.matchStats = matchStats;
}
