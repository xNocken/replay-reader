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

  ignoreChannel (group) {
    this._ignore.push(group);
  }

  isIgnoringChannel(group) {
    return this._ignore.includes(group);
  }
}

module.exports = UChannel;
