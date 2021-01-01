class UChannel {
  _ignore = [];
  channelName;
  channelIndex;
  channelType;
  actor;

  get archetypeId() {
    return this.actor?.archettype?.value;
  }

  get aactorId() {
    return this.actor?.actorNetGUID?.value;
  }

  ignoreChanneel (group) {
    this._ignore.push(group);
  }

  isIgnoringChannel(group) {
    return this._ignore.includes(group);
  }
}

module.exports = UChannel;
