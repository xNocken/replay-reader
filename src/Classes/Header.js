class Header {
  Magic = 0;
  NetworkVersion = 0;
  NetworkChecksum = 0;
  EngineNetworkVersion = 0;
  GameNetworkProtocolVersion = 0;
  Guid = 0;
  Major = 0;
  Minor = 0;
  Patch = 0;
  Changelist = 0;
  Branch = '';
  LevelNamesAndTimes = [];
  Flags = 0;
  gameSpecificData = [];
}

module.exports = Header;
