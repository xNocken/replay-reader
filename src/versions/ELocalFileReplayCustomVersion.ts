enum ELocalFileReplayCustomVersion {
  // Before any version changes were made
  BeforeCustomVersionWasAdded = 0,

  FixedSizeFriendlyName = 1,
  CompressionSupport = 2,
  RecordingTimestamp = 3,
  StreamChunkTimes = 4,
  FriendlyNameCharEncoding = 5,
  EncryptionSupport = 6,
  CustomVersions = 7,

  // -----<new versions can be added above this line>-------------------------------------------------
  VersionPlusOne,
  LatestVersion = VersionPlusOne - 1
}

export default ELocalFileReplayCustomVersion;
