const unrealNames = [];
unrealNames[0] = 'None';
unrealNames[1] = 'ByteProperty';
unrealNames[2] = 'IntProperty';
unrealNames[3] = 'BoolProperty';
unrealNames[4] = 'FloatProperty';
unrealNames[5] = 'ObjectProperty';
unrealNames[6] = 'NameProperty';
unrealNames[7] = 'DelegateProperty';
unrealNames[8] = 'DoubleProperty';
unrealNames[9] = 'ArrayProperty';
unrealNames[10] = 'StructProperty';
unrealNames[11] = 'VectorProperty';
unrealNames[12] = 'RotatorProperty';
unrealNames[13] = 'StrProperty';
unrealNames[14] = 'TextProperty';
unrealNames[15] = 'InterfaceProperty';
unrealNames[16] = 'MulticastDelegateProperty';
// unrealNames[17] = 'Available';
unrealNames[18] = 'LazyObjectProperty';
unrealNames[19] = 'SoftObjectProperty';
unrealNames[20] = 'UInt64Property';
unrealNames[21] = 'UInt32Property';
unrealNames[22] = 'UInt16Property';
unrealNames[23] = 'Int64Property';
unrealNames[25] = 'Int16Property';
unrealNames[26] = 'Int8Property';
// unrealNames[27] = 'Available';
unrealNames[28] = 'MapProperty';
unrealNames[29] = 'SetProperty';

// Special packages.
unrealNames[30] = 'Core';
unrealNames[31] = 'Engine';
unrealNames[32] = 'Editor';
unrealNames[33] = 'CoreUObject';

// More class properties
unrealNames[34] = 'EnumProperty';

// Special types.
unrealNames[50] = 'Cylinder';
unrealNames[51] = 'BoxSphereBounds';
unrealNames[52] = 'Sphere';
unrealNames[53] = 'Box';
unrealNames[54] = 'Vector2D';
unrealNames[55] = 'IntRect';
unrealNames[56] = 'IntPoint';
unrealNames[57] = 'Vector4';
unrealNames[58] = 'Name';
unrealNames[59] = 'Vector';
unrealNames[60] = 'Rotator';
unrealNames[61] = 'SHVector';
unrealNames[62] = 'Color';
unrealNames[63] = 'Plane';
unrealNames[64] = 'Matrix';
unrealNames[65] = 'LinearColor';
unrealNames[66] = 'AdvanceFrame';
unrealNames[67] = 'Pointer';
unrealNames[68] = 'Double';
unrealNames[69] = 'Quat';
unrealNames[70] = 'Self';
unrealNames[71] = 'Transform';

// Object class names.
unrealNames[100] = 'Object';
unrealNames[101] = 'Camera';
unrealNames[102] = 'Actor';
unrealNames[103] = 'ObjectRedirector';
unrealNames[104] = 'ObjectArchetype';
unrealNames[105] = 'Class';
unrealNames[106] = 'ScriptStruct';
unrealNames[107] = 'Function';

// Misc.
unrealNames[200] = 'State';
unrealNames[201] = 'TRUE';
unrealNames[202] = 'FALSE';
unrealNames[203] = 'Enum';
unrealNames[204] = 'Default';
unrealNames[205] = 'Skip';
unrealNames[206] = 'Input';
unrealNames[207] = 'Package';
unrealNames[208] = 'Groups';
unrealNames[209] = 'Interface';
unrealNames[210] = 'Components';
unrealNames[211] = 'Global';
unrealNames[212] = 'Super';
unrealNames[213] = 'Outer';
unrealNames[214] = 'Map';
unrealNames[215] = 'Role';
unrealNames[216] = 'RemoteRole';
unrealNames[217] = 'PersistentLevel';
unrealNames[218] = 'TheWorld';
unrealNames[219] = 'PackageMetaData';
unrealNames[220] = 'InitialState';
unrealNames[221] = 'Game';
unrealNames[222] = 'SelectionColor';
unrealNames[223] = 'UI';
unrealNames[224] = 'ExecuteUbergraph';
unrealNames[225] = 'DeviceID';
unrealNames[226] = 'RootStat';
unrealNames[227] = 'MoveActor';
unrealNames[230] = 'All';
unrealNames[231] = 'MeshEmitterVertexColor';
unrealNames[232] = 'TextureOffsetParameter';
unrealNames[233] = 'TextureScaleParameter';
unrealNames[234] = 'ImpactVel';
unrealNames[235] = 'SlideVel';
unrealNames[236] = 'TextureOffset1Parameter';
unrealNames[237] = 'MeshEmitterDynamicParameter';
unrealNames[238] = 'ExpressionInput';
unrealNames[239] = 'Untitled';
unrealNames[240] = 'Timer';
unrealNames[241] = 'Team';
unrealNames[242] = 'Low';
unrealNames[243] = 'High';
unrealNames[244] = 'NetworkGUID';
unrealNames[245] = 'GameThread';
unrealNames[246] = 'RenderThread';
unrealNames[247] = 'OtherChildren';
unrealNames[248] = 'Location';
unrealNames[249] = 'Rotation';
unrealNames[250] = 'BSP';
unrealNames[251] = 'EditorSettings';
unrealNames[252] = 'AudioThread';
unrealNames[253] = 'ID';
unrealNames[254] = 'UserDefinedEnum';
unrealNames[255] = 'Control';
unrealNames[256] = 'Voice';
unrealNames[257] = 'Zlib';
unrealNames[258] = 'Gzip';

// Online
unrealNames[280] = 'DGram';
unrealNames[281] = 'Stream';
unrealNames[282] = 'GameNetDriver';
unrealNames[283] = 'PendingNetDriver';
unrealNames[284] = 'BeaconNetDriver';
unrealNames[285] = 'FlushNetDormancy';
unrealNames[286] = 'DemoNetDriver';
unrealNames[287] = 'GameSession';
unrealNames[288] = 'PartySession';
unrealNames[289] = 'GamePort';
unrealNames[290] = 'BeaconPort';
unrealNames[291] = 'MeshPort';
unrealNames[292] = 'MeshNetDriver';
unrealNames[293] = 'LiveStreamVoice';

// Texture settings.
unrealNames[300] = 'Linear';
unrealNames[301] = 'Point';
unrealNames[302] = 'Aniso';
unrealNames[303] = 'LightMapResolution';

// Sound.
//310 =
unrealNames[311] = 'UnGrouped';
unrealNames[312] = 'VoiceChat';

// Optimized replication.
unrealNames[320] = 'Playing';
unrealNames[322] = 'Spectating';
unrealNames[325] = 'Inactive';

// Log messages.
unrealNames[350] = 'PerfWarning';
unrealNames[351] = 'Info';
unrealNames[352] = 'Init';
unrealNames[353] = 'Exit';
unrealNames[354] = 'Cmd';
unrealNames[355] = 'Warning';
unrealNames[356] = 'Error';

// File format backwards-compatibility.
unrealNames[400] = 'FontCharacter';
unrealNames[401] = 'InitChild2StartBone';
unrealNames[402] = 'SoundCueLocalized';
unrealNames[403] = 'SoundCue';
unrealNames[404] = 'RawDistributionFloat';
unrealNames[405] = 'RawDistributionVector';
unrealNames[406] = 'InterpCurveFloat';
unrealNames[407] = 'InterpCurveVector2D';
unrealNames[408] = 'InterpCurveVector';
unrealNames[409] = 'InterpCurveTwoVectors';
unrealNames[410] = 'InterpCurveQuat';

unrealNames[450] = 'AI';
unrealNames[451] = 'NavMesh';

unrealNames[500] = 'PerformanceCapture';

// Special config names - not required to be consistent for network replication
unrealNames[600] = 'EditorLayout';
unrealNames[601] = 'EditorKeyBindings';
unrealNames[602] = 'GameUserSettings';

module.exports = unrealNames;
