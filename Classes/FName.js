class FName {
  name;

  serialize(reader) {
    this.name = reader.readFName();
  }
}

module.exports = FName;
