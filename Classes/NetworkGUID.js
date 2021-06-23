class NetworkGUID {
  isValid() {
    return this.value > 0;
  }

  isDynamic() {
    return this.value > 0 && (this.value & 1) != 1;
  }

  isDefault() {
    return this.value == 1;
  }

  serialize(reader) {
    this.value = reader.readIntPacked();
  }
}

module.exports = NetworkGUID;
