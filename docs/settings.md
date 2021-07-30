# Settings

## parseLevel: `number`
The parseLevel setting decides what data you want to parse. Which level corresponds to what data can be set in [NetFieldExports](./addOwnExports.md#create-netfieldexports).

## debug: `boolean`
Debug mode has two features currently. It tells you how fast it parses and how far it is and it creates 3 files. 'netfieldexports.txt', 'netGuidToPathName.txt' and 'notReadingGroups.txt'. More about this and how to create custom exports can be found [here](./addOwnExports.md).

Notice: Enabling this option can reduce the speed of the parser by ~50%.

## netFieldExportPath: `string`
The netFieldExportPath setting can be used to include your own netFieldExports.

More about netFieldExports and creating your own exports can be found [here](./addOwnExports.md#create-netfieldexports).

## customClassPath: `string`
The customClassPath setting can be used to include your own classes.

More about classes and creating your own exports can be found [here](./addOwnExports.md#create-classes).

## customEnumPath: `string`
The customEnumPath setting cane be used to include your own enums.

More about enums and creating your own exports can be found [here](./addOwnExports.md#create-enums).

## onlyUseCustomNetFieldExports: `boolean`
This option decides whether or not the parser will use netFieldExports (imported via [netFieldExportPath](#netFieldExportPath)). If set to `false`, the default netFieldExports will be used (those can be overwritten by custom ones).

## onExportRead: `function`
This setting overwrites the default export function and is required if you add custom netFieldExports. 

More about this function and how to parse custom data can be found [here](./addOwnExports.md#custom-on-export-read).

## onNetDeltaRead: `function`
This setting overwrites the default netDeltaExport function and may be required if you add custom netFieldExports. 

More about this function and how to parse custom data can be found [here](./addOwnExports.md#custom-on-export-read).

## onChannelOpened: `function`
This function is called when a new channel is opened. 

More about this function and how to parse custom data can be found [here](./addOwnExports.md).

## onChannelClosed: `function`
This function is called when a channel gets closed. 

More about this function and how to parse custom data can be found [here](./addOwnExports.md).
