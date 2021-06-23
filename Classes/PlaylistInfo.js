class PlaylistInfo {
  id;
  name;

  serialize(reader) {
    if (reader.header.EngineNetworkVersion >= 11) {
      reader.readBit();
    }
    reader.readBit();
    this.id = reader.readIntPacked();
    reader.skipBits(31);
  }

  resolve(cache) {
    this.name = cache.tryGetPathName(this.id);
  }

  toJSON() {
    return this.name;
  }
}

module.exports = PlaylistInfo;
