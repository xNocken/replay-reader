const FRotator = require('./FRotator');
const FVector = require('./FVector');
const NetworkGUID = require('../../Classes/NetworkGUID');

class Actor {
  /**
   * @type {NetworkGUID}
   */
  actorNetGUID;
  /**
   * @type {NetworkGUID}
   */
  archetype;
  /**
   * @type {NetworkGUID}
   */
  level;
  /**
   * @type {FVector}
   */
  location;
  /**
   * @type {FRotator}
   */
  rotation;
  /**
   * @type {FVector}
   */
  scale;
  /**
   * @type {FVector}
   */
  velocity;
}

module.exports = Actor;
