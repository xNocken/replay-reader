class FDateTime {
  time;

  serialize(reader) {
    this.time = new Date(parseInt((reader.readUInt64() - BigInt('621355968000000000')) / BigInt('10000'), 10));
  }

  toJSON() {
    return this.time.toISOString();
  }
}

module.exports = FDateTime;
