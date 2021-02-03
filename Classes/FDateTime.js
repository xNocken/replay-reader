class FDateTime {
  time;

  serialize(reader) {
    this.time = new Date(parseInt(reader.readUInt64()), 10); // TODO: Fix
  }
}

module.exports = FDateTime;
