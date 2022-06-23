class FDateTime {
  serialize(reader) {
    this.time = reader.readDate();
  }

  toJSON() {
    return this.time.toISOString();
  }
}

module.exports = FDateTime;
