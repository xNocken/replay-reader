const AbstractEvent = require('./AbstractEvent');

class MatchStatsEvent extends AbstractEvent {
  Eliminations = '';
  Accuracy = '';
  Assists = '';
  WeaponDamage = '';
  OtherDamage = '';
  DamageToPlayers = '';
  Revives = '';
  DamageTaken = '';
  DamageToStructures = '';
  MaterialsGathered = '';
  MaterialsUsed = '';
  TotalTraveled = '';
}

module.exports = MatchStatsEvent;
