# Settings

## parseLevel
Type: Number

The parseLevel setting decides what data you want to parse. Which level corresponds to what data can be set in [NetFieldExports](./addOwnExports.md#create-netfieldexports)

## debug
Type: boolean

Debug mode has two features currently. It tells you how fast it parses and how far it is and it creates 3 files. 'netfieldexports.txt', 'netGuidToPathName.txt' and 'notReadingGroups.txt'. More about this and how to create custom exports can be found [here](./addOwnExports.md)

Notice: The debug mode reduces the speed by about 50%

## netFieldExportPath
Type: path

The netFieldExportPath setting is used to include your own netfieldexports. The path is relative to where you start node. More to netFieldExports and creating your own exports can be found [here](./addOwnExports.md#create-netfieldexports)

## customClassPath
Type: path

The customClassPath setting is used to include your own classes. The path is relative to where you start node. More to classes and creating your own exports can be found [here](./addOwnExports.md#create-classes)

## customEnumPath
Type: path

The customEnumPath setting is used to include your own enums. The path is relative to where you start node. More to enums and creating your own exports can be found [here](./addOwnExports.md#create-enums)

## onlyUseCustomNetFieldExports
Type: boolean

The onlyUseCustomNetFieldExpots setting decides whether or not it uses the default netFieldExports. If true only netFieldExports imported via the [netFieldExportPath](#netFieldExportPath) setting will be used. If false default ones will be used but can be overwritten by custom ones.

## onExportRead
Type: function

This setting overwrites the default export function and is required if you add custom netFieldExports. More about this function and how to parse custom data can be found [here](./addOwnExports.md#custom-on-export-read)

## onNetDeltaRead
Type: function

This setting overwrites the default netDeltaExport function and may be required if you add custom netFieldExports. More about this function and how to parse custom data can be found [here](./addOwnExports.md#custom-on-export-read)

## onChannelOpened
Type: function

This function is called when a new channel gets opened. More about this function and how to parse custom data can be found [here](./addOwnExports.md)

## onChannelClosed
Type: function

This function is called when a channel gets closed. More about this function and how to parse custom data can be found [here](./addOwnExports.md)
