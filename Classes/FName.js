class FName {
  name;

  serialize(reader) {
    this.name = reader.readFName();
  }

  toJSON() {
    return this.name;
  }
}

module.exports = FName;
