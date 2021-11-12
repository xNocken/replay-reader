# Settings

## parseLevel
The parseLevel setting decides what data you want to parse. Which level corresponds to what data can be set in [NetFieldExports](./addOwnExports.md#create-netfieldexports).

## debug: `boolean`
Debug mode has two features currently. It tells you how fast it parses and how far it is and it creates 3 files. 'netfieldexports.txt', 'netGuidToPathName.txt' and 'notReadingGroups.txt'. More about this and how to create custom exports can be found [here](./addOwnExports.md).

Notice: Enabling this option can reduce the speed of the parser by ~50%.

## customNetFieldExports: `Array<NetFieldExport>`
The customNetFieldExports setting can be used to include your own netFieldExports.

More about netFieldExports and creating your own exports can be found [here](./addOwnExports.md#create-netfieldexports).

## customClassPath: `string`
The customClassPath setting can be used to include your own classes.

More about classes and creating your own exports can be found [here](./addOwnExports.md#create-classes).

## customEnumPath: `string`
The customEnumPath setting cane be used to include your own enums.

More about enums and creating your own exports can be found [here](./addOwnExports.md#create-enums).

## onlyUseCustomNetFieldExports: `boolean`
This option decides whether or not the parser will use the default netFieldExports. If set to `false`, the default netFieldExports will be used (those can be overwritten by custom ones).

## handleEventEmitter: `function`
This setting overwrites the export for the parsed data. This function takes as argument an object where 4 event emitters are sent 'propertyExportEmitter', 'actorDespawnEmitter', 'netDeltaReadEmitter' and 'parsingEmitter'.

More about this function and how to parse custom data can be found [here](./addOwnExports.md#custom-on-export-read).

## fastForwardThreshold `number`
This setting sets the threshhold for the setFastForward feature. If the next checkpoint is less than `fastForwardThreshold` far away the checkpoint is not taken to save time.

## useCheckpoints `boolean`
This setting decides if the last checkpoint should be taken directly. this option increases the parsing speed considerably but it comes with the disadvantage that not all infos are available and the history of the match is not available. An alternative to this option would be the [fastForward](./addOwnExports.md#use-fast-forwarding) option.

## maxConcurrentDownloads `number`
This setting is used for the streaming feature and sets the limit on how many data chunks can be downloaded at once. 
The more chunks you download at once the faster it will finish parsing. 
But too many at once can overwhelm your internet.

## maxConcurrentEventDownloads `number`
This is the same as `maxConcurrentDownloads` but for events.
The same applier here but events are much smaller and therefore can handle more at once.

## parseEvents `boolean` 
This settings decides whether or not events should be parsed. They contain data about player elims and simple match stats

## parsePackets `boolean`
This settings decides whether or not data chunks should be parsed. They contain everything. But maybe parsing events is enough data
