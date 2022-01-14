class Header {
  magic = 0;
  networkVersion = 0;
  networkChecksum = 0;
  engineNetworkVersion = 0;
  gameNetworkProtocolVersion = 0;
  guid = 0;
  major = 0;
  minor = 0;
  patch = 0;
  changelist = 0;
  branch = '';
  levelNamesAndTimes = [];
  flags = 0;
  gameSpecificData = [];
}

module.exports = Header;
