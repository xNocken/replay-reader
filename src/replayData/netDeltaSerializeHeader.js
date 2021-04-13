const NetDeltaSerializeHeader = (reader) => {
  return {
    arrayReplicationKey: reader.readInt32(),
    baseReplicationKey: reader.readInt32(),
    numDeletes: reader.readInt32(),
    numChanged: reader.readInt32()
  }
};

module.exports = NetDeltaSerializeHeader;
