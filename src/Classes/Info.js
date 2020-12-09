class Info {
  constructor() {
    this.LengthInMs = 0;
    this.NetworkVersion = 0;
    this.Changelist = 0;
    this.FriendlyName = 0;
    this.Timestamp = 0;
    this.TotalDataSizeInBytes = 0;
    this.IsLive = 0;
    this.IsCompressed = 0;
    this.IsEncrypted = false;
    this.EncryptionKey = [];
    this.FileVersion = [];
  }
}

module.exports = Info;
