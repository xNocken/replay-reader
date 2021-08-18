class UChannel {
  _ignore = [];
  channelName;
  channelIndex;
  channelType;
  actor;

  get archetypeId() {
    return this.actor?.archetype?.value;
  }

  get actorId() {
    return this.actor?.actorNetGUID?.value;
  }
}

module.exports = UChannel;
