class FAthenaPawnReplayData {
  serialize(reader) {
    const length = reader.readUInt32();
    this.encryptedPlayerData = reader.readBytes(length);
  }
}

module.exports = FAthenaPawnReplayData;
