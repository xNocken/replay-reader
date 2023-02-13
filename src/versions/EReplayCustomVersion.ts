enum EReplayCustomVersion {
  BeforeCustomVersionWasAdded = 0,

  // Original replay versions from ENetworkVersionHistory
  ReplayInitial = 1,
  SaveAbsTimeMs = 2,					// We now save the abs demo time in ms for each frame (solves accumulation errors)
  IncreaseBuffer = 3,					// Increased buffer size of packets, which invalidates old replays
  SaveEngineVersion = 4,				// Now saving engine net version + InternalProtocolVersion
  ExtraVersion = 5,					// We now save engine/game protocol version, checksum, and changelist
  MultipleLevels = 6,					// Replays support seamless travel between levels
  MultipleLvelsTimeChanges,			// Save out the time that level changes happen
  DeletedStartupActors = 8,			// Save DeletedNetStartupActors inside checkpoints
  HeaderFlags = 9,					// Save out enum flags with demo header
  LevelStreamingFixes = 10,			// Optional level streaming fixes.
  SaveFullEngineVersion = 11,			// Now saving the entire FEngineVersion including branch name
  HeaderGuid = 12,					// Save guid to demo header
  CharacterMovement = 13,				// Change to using replicated movement and not interpolation
  CharacterMovementNoInterp = 14,		// No longer recording interpolated movement samples
  GuidNameTable = 15,					// Added a string table for exported guids
  GuidCacheChecksums = 16,			// Removing guid export checksums from saved data, they are ignored during playback
  SavePackageVersionUE = 17,			// Save engine and licensee package version as well, in case serialization functions need them for compatibility
  RecordingMetadata = 18,				// Adding additional record-time information to the header
  CustomVersions = 19,				// Serializing replay and network versions as custom verions going forward

  // -----<new versions can be added above this line>-------------------------------------------------
  VersionPlusOne,
  LatestVersion = VersionPlusOne - 1,

  MinSupportedVersion = CharacterMovement	// Minimum supported playback version
}

export default EReplayCustomVersion;
