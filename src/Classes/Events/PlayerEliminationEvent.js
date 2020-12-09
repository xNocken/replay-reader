const AbstractEvent = require('./AbstractEvent');

class PlayerEliminationEvent extends AbstractEvent {
  Eliminated = '';
  Eliminator = '';
  GunType = 0;
  Time = '';
  Knocked = false;
}

module.exports = PlayerEliminationEvent;
