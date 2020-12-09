const AbstractEvent = require('./AbstractEvent');

class MatchTeamStatsEvent extends AbstractEvent {
  Position = 0;
  TotalPlayers = 0;
}

module.exports = MatchTeamStatsEvent;
