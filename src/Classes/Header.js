class Header {
  constructor() {
    this.Magic = 0;
    this.NetworkVersion = 0;
    this.NetworkChecksum = 0;
    this.EngineNetworkVersion = 0;
    this.GameNetworkProtocolVersion = 0;
    this.Guid = 0;
    this.Major = 0;
    this.Minor = 0;
    this.Patch = 0;
    this.Changelist = 0;
    this.Branch = '';
    this.LevelNamesAndTimes = [];
    this.Flags = 0;
    this.gameSpicificData = [];
  }
}

module.exports = Header;
