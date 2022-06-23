# Add own exports

## Example project
I have made an example project where you can see everything. There are also examples for typings.

The link can be found [here](https://github.com/xNocken/replay-reader-demo-project).

## What should I know about replays?
Replays use so called netFieldExports to parse their packets. The replays provide the information about which part of the replay has which property, and we provide the information about how to parse them. There are 2 types of netFieldExports. The first one has only the properties. The other is the ClassNetCache and is used to get extended data (custom structure), call functions, and add or remove items from lists. Packets contain only the data that has changed.

## Where can I find the properties of an object?
You can use the debug mode to create a list of all objects included in the replay.

## Create a custom netFieldExport
The first thing you need to decide is what kind of data you want to evaluate. Most likely you want to evaluate a normal property like the kills of a player. The others are rather rare and will be explained later.

The next step is to find out where this property is stored. For example, if you want to find out the radius of the current storm, you have to look in ``debug-notReadNFE.txt``. If you search for safezone, you will find the export ``/Game/Athena/SafeZone/SafeZoneIndicator.SafeZoneIndicator_C``. The string is the path for this object and the object has the property ``Radius``.

Now that you know the object and property you want to parse, we can start creating the netFieldExport. It is best to create a folder for your exports and save each export in json files. So you can then put an index.js in the folder which requires all json files and then exports them in an array. All netfieldexports will be specified as an array in the option ``customNetFieldExports``. The structure can be found [here](./net-field-export-structure.md).

Now follow these steps:
- Add the path to the path array
- Set the parseLevel to 1
- Add a property with the exact name
- Add the right [parseType](./net-field-export-structure.md#parsetype-string)
- Add the options ``exportName``, ``exportGroup`` and ``exportType``
- Add the required configurations for the property

In the end it should look something like this:
```json
{
  "path": [
    "/Game/Athena/SupplyDrops/AthenaSupplyDrop.AthenaSupplyDrop_C"
  ],
  "parseLevel": 1,
  // export group can be anything you want. This is used for the result object to categorize the exports
  "exportGroup": "mapData",
  "exportName": "supplyDrops",
  "exportType": "array",
  "properties": {
    "Opened": {
      "parseFunction": "readBit",
      "parseType": "default"
    },
    "BalloonPopped": {
      "parseFunction": "readBit",
      "parseType": "default"
    }
  }
}
```

The next step is the processing of the exported data.

If you don't know what type the property is, just use 'readClass' as 'parsetype' and 'DebugObject' as 'type'.

## Create a custom export function
First step: create a function like [this](#export-function) and add it to the [handleEventEmitters setting](./settings.md#customnetfieldexports-arraynetfieldexport):
```js
const onExportRead = ({ propertyExportEmitter }) => {
  propertyExportEmitter.on('SafeZoneIndicator.SafeZoneIndicator_C', handleSafezone)
};
```

the 2 most important properties are ``result`` and ``data``. ```data``` contains the updates and ```result``` is returned when the parsing of the replay is done. so our goal is to get the data that is in ```data``` into ```result```. One way could look like this:

```js
const handleSafezone = ({ data, result }) => {
  // When a new safezone arrives all properties are updated so we can just check if 'SafeZoneStartShrinkTime' and 'SafeZoneFinishShrinkTime' are set to check if a zone arrived
  if (data.SafeZoneStartShrinkTime && data.SafeZoneFinishShrinkTime) {
    // When a new zone arrives we simply take all the data and push it into the result object to 'result.gameData.safeZones' which was created by the properties 'exportGroup', 'exportName' and 'exportType'.
    result.gameData.safeZones.push(data);
  }
};
```

Most of the time, however, we also need properties that do not update constantly. So we need another way to store the data. this is where the property ``states`` comes into play. This property contains an object for each netfieldexport you have created. The name of the object can be defined by the ``exportName`` in the netfieldexport. There you have the possibility to save the properties after the actorId to be able to access them quickly. Here is an example:

```js
const handleSupplyDrop = ({ actorId, data, states, result, changedProperties }) => {
  // does this object already exist or is it new?
  if (!states.supplyDrops[actorId]) {
    // if it is new save it in states
    states.supplyDrops[actorId] = data;
    // and save a copy in the result object
    result.mapData.supplyDrops.push(data);

    return;
  }

  // if it already exists look through all properties and overwrite the old data
  for (let i = i; i < changedProperties.length; i++) {
    const key = changedProperties[i];

    states.supplyDrops[actorId][key] = data[key];
  }
};
```

## Use fast forwarding
With the export functions a function named `setFastForward` is given. With this you can jump through the replay if you know where the data is. This can be used for example with safezones.

```js
const handleSafezone = ({ data, result, states, setFastForward, timeSeconds }) => {
  if (data.SafeZoneFinishShrinkTime && states.safeZones.lastShrinkTime != data.SafeZoneFinishShrinkTime) {
    // save current safezone
    result.gameData.safeZones.push(data);

    // the `SafeZoneFinishShrinkTime` is in time since the match started
    // We need to calculate it into time since the replay started
    const nextShrinkTime = data.SafeZoneFinishShrinkTime - (states.gameState.ReplicatedWorldTimeSeconds - timeSeconds);

    // safe the last shrink time so that we can see when a new zone arrived
    states.safeZones.lastShrinkTime = data.SafeZoneFinishShrinkTime;

    // now we call the function to set the fast forward target
    setFastForward(nextShrinkTime);
  }
};
```

## Troubleshooting
You've gone through all this effort and nothing works. This can have multiple reasons.
- [The object you want to parse is part of the map]()
- [The data you're trying to parse is Part of a classNetCache](#parse-classnetcache)
- [You have multiple properties with the same name and they override each other](#handle-doubled-properties)
- The object is something extremly special and needs needs to be parsed in a weird way

## Parse classNetCache
There are 3 different types of ClassNetCache properties. Functions, custom struct and netDeltaProperty.

All classnetcache have '_ClassNetCache' as suffix. The netFieldExport for a ClassNetCache must have the property "type" with the value "ClassNetCache".

### Functions
Functions are the simplest of all. They are easy to recognize in the export because the function name is separated from the normal path with a ':'.

For this example we just use the function to place a map marker. This is the function ``ClientRemotePlayerAddMapMarker`` on the property ``FortBroadcastRemoteClientInfo_ClassNetCache``.  For this we first create a netfieldexport for the classnetcache:
```json
{
  "path": [
    "FortBroadcastRemoteClientInfo_ClassNetCache"
  ],
  "parseLevel": 1,
  "type": "ClassNetCache",
  "properties": {
    "ClientRemotePlayerAddMapMarker": {
      "type": "/Script/FortniteGame.FortBroadcastRemoteClientInfo:ClientRemotePlayerAddMapMarker",
      "parseType": "function"
    }
  }
}
```
The type is the path of the netfieldexport for the function. for this we also have to create a netfieldexport for the data itself.

```json
{
  "path": [
    "/Script/FortniteGame.FortBroadcastRemoteClientInfo:ClientRemotePlayerAddMapMarker"
  ],
  "parseLevel": 1,
  "exportGroup": "gameData",
  "exportName": "markers",
  "exportType": "array",
  "properties": {
    "PlayerID": {
      "parseFunction": "readUInt32",
      "parseType": "default"
    }
  }
}
```

That's all there is to it. now we just have to create an export function that handles the data. The export here is of type propertyExport and the key is everything after the /. so in this case ```FortniteGame.FortBroadcastRemoteClientInfo:ClientRemotePlayerAddMapMarker```

### Class
This is a type that loads a class for parsing and calls the serialize and resolve functions.

In this example we use the playlistinfo.

For this we need a netfieldexport for the classnetcache which should look like this:
```json
{
  "path": [
    "Athena_GameState_C_ClassNetCache"
  ],
  "parseLevel": 1,
  "type": "ClassNetCache",
  "exportGroup": "gameData",
  "exportName": "playlistInfo",
  "exportType": "null",
  "properties": {
    "CurrentPlaylistInfo": {
      "type": "PlaylistInfo",
      "parseType": "class"
    }
  }
}

```
The class has a 'serialize' function. The argument is a reader on which all functions can be called to read the property.

Optionally a 'resolve' function can be implemented which takes the netguid cache as argument.

For the PlaylistInfo it looks like this:

```js
class PlaylistInfo {
  serialize(reader) {
    if (reader.header.engineNetworkVersion >= 11) {
      reader.skipBits(1);
    }

    reader.skipBits(1);

    this.id = reader.readIntPacked();

    reader.skipBits(31);
  }

  resolve(netGuidCache) {
    this.name = netGuidCache.tryGetPathName(this.id);
  }
}
```

The class is then sent to the propertyExport as ``data``. The key is the path of the classnetcache.

## NetDeltaExport
NetDeltaExports are used to transfer arrays. An update can add items but also remove them. Each item that is added or deleted gets its own export call. Implementing NetDeltaExports is a bit more complex than the other ways but also straight forward.

In data there are 4 properties. ``deleted``, ``elementIndex``, ``path`` and ``export``.

``elementIndex`` is the index in the array which gets an update.

``deleted`` determines if the item was deleted at the location.

``export`` contains the new data for the item at the location.

For this example, we use the inventory of players. We need 2 NetFieldExports for this. The first one is the one of the classNetCache and the second one is the one of the inventory. The second one contains the properties of the items.

```json
{
  "path": [
    "FortInventory_ClassNetCache"
  ],
  "type": "ClassNetCache",
  "parseLevel": 1,
  "properties": {
    "Inventory": {
      "type": "/Script/FortniteGame.FortInventory",
      "parseType": "netDeltaSerialize"
    }
  }
}
```

```json
{
  "path": [
    "/Script/FortniteGame.FortInventory"
  ],
  "parseLevel": 1,
  "exportName": "inventories",
  "exportGroup": "gameData",
  "exportType": "array",
  "properties": {
    "ItemDefinition": {
      "type": "ItemDefinition",
      "parseType": "readClass"
    }
  }
}
```

In the case of the FortInventory, 2 exports are required. I am not sure if you will need this for others as I only export two netDeltaExports.  A [propertyExport](../export/propertyExport/handleInventory.js) and a [netDeltaExport](../export/netDeltaExport/handleInventory.js).

## Handle doubled properties
Some objects may contain the same property multiple times. This can happen when multiple properties are the same class. For example the FundingManager has an array `Funding choices` which contains two properties `Option1` and `Option2`. Using a umap file we can see that the game stores the funding manager like this:

```json
{
  "IndexedFundingData": {
    "CurrentFundingArray": [
      "Int64Property"
    ],
    "FinalFundingAmount": "Int64Property",
    "TowerFundingAmount": "Int64Property"
  },
  "FundingChoices": [
    {
      "Option1": {
        "OptionTag": {
          "TagName": "NameProperty"
        },
        "CurrentFundingAmount": "Int64Property"
      },
      "Option2": {
        "OptionTag": {
          "TagName": "NameProperty"
        },
        "CurrentFundingAmount": "Int64Property"
      },
      "TargetFundingAmount": "Int64Property"
    }
  ]
}
```

but the netFieldExport looks like this:

```
  CurrentFunds: 15
  CurrentFunds: 16
  FundingChoices: 19
  OptionTag: 20
  CurrentFundingAmount: 21
  OptionTag: 22
  CurrentFundingAmount: 23
  TargetFundingAmount: 24
```

I guess the CurrentFunds property is the CurrentFundingArray property just with a different name. As you can see the CurrentFunds is there twice but thats not a problem because two properties with the same name right next to each other indicates that this is an array with only once type.

But OtionsTag und CurrentFundingAmount are a problem.

Just to make it clear the CurrentFunds is int64 array and fundingChoices is a dynamic array with Option1 and Option2 as properties. Option 1 and 2 are a class that contains the properties OptionTag and CurrentFundingAmount.

To solve this problem we use the `storeAsHandle` option. This can be set in the exportGroup settings to export every property as a handle or on the export to only export this export as the handle.

The handle is the number next to the property name in the `debug-notReadNFE.txt` and `debug-readNFE.txt` files. But they shouldnt be hardcoded because they can change in the future.

The best aproach is to get the netFieldExport provided in the export function and find the handles using the name. Here is an example

For simplicity im going to assume that the `Option1` and `Option2` are in the root and not part of the `FundingChoices` array.

```js
const handleFundingStations = ({ data, states, netFieldExports }) => {
  // if the handle is not cached, find it
  if (!states.optionsStartHandles) {
    // find all properties that have the name OptionTag
    states.optionsStartHandles = netFieldExports.filter(Boolean).filter(({ name }) => name === 'OptionTag');
  }

  const option1 = {
    // because the data contains the value as the handle we can just get it because we know that option1 comes first
    OptionTag: data[states.optionsStartHandles[0].handle],
    // just increase it by one because the CurrentFundingAmount is the next property. Keep in mind that this can change too
    CurrentFundingAmount: data[states.optionsStartHandles[0].handle + 1],
  };

  const option2 = {
    // here we use the second property that has the name OptionTag
    OptionTag: data[states.optionsStartHandles[1].handle],
    CurrentFundingAmount: data[states.optionsStartHandles[1].handle + 1],
  };
})
```

## Parse Functions
The parse functions decide how a property is parsed. Different functions require different arguments.

Missing functions can be found [Here](../src/Classes/Replay.js)

### readBit
- name: readBit
- returns: boolean
- size: 1 bit

### readIntPacked
- name: readBit
- returns: number
- size: 1 to infinity bytes

### readInt64
- name: readInt64
- returns: number
- size: 8 bytes

### readInt32
- name: readInt32
- returns: number
- size: 4 bytes

### readInt16
- name: readInt16
- returns: number
- size: 2 bytes

### readByte
- name: readByte
- returns: number
- size: 1 byte

### readNetId
- name: readNetId
- returns: string
- size: 32

### readString
- name: readString
- returns: string
- size: unknown


## Export function
```js
const handleEventEmitter = ({
  propertyExportEmitter,
  actorDespawnEmitter,
  netDeltaReadEmitter,
  parsingEmitter,
}) => {
    propertyExportEmitter.on('SafeZoneIndicator.SafeZoneIndicator_C', ({
      chIndex: number, // This can be seen as the unique identifier for an object
      data: Export, // The value contains the changed values. It has two consistant properties. Type: this is the type of the export.
      actor: Actor, // the actor that is being exported
      actorId: number, // the id of the actor
      Path: this is the full exportPath of the object
      timeSeconds: number, // This is the time in seconds since the replay started recording
      staticActorId?: string, // This is the name of an actor thats placed on the map. Its unique across replays
      globalData: GlobalData, // this is a class with all data
      result: Object, // This object contains objects which were built from the exportgroups and exportnames. this object will be returned at the end as the result when the parsing is finished.
      states: Object, // this object contains objects specified by the exportName and the additionalStates setting and is used to store the state of objects temporarily
      setFastForward: (time: number) => void, // with this property can be fastforwarded through the replay
      endParsing: () => void, // calling this function stops the parsing of thr replay after the chunk
      changedProperties: string[], // This array contains all property names that changed in this export
    }) => void)

    actorDespawnEmitter.on('SafeZoneIndicator.SafeZoneIndicator_C', ({
      chIndex: number,
      actor: Actor,
      actorId: number,
      timeSeconds: number,
      staticActorId?: string,
      globalData: GlobalData,
      result: Object,
      states: Object,
      openPacket: boolean, // Tells if the package that was closed was also opened
      netFieldExportGroup: any, // This property shows what type the actor had
      setFastForward: (time: number) => void, // with this property can be fastforwarded through the replay
      endParsing: () => void, // calling this function stops the parsing of thr replay after the chunk
    }) => void)

    netDeltaReadEmitter.on('SafeZoneIndicator.SafeZoneIndicator_C', ({
      chIndex: number,
      actor: Actor,
      actorId: number,
      data: NetDeltaExportData,
      timeSeconds: number,
      staticActorId?: string,
      globalData: GlobalData,
      result: Object,
      states: Object,
      setFastForward: (time: number) => void, // with this property can be fastforwarded through the replay
      endParsing: () => void, // calling this function stops the parsing of thr replay after the chunk
      changedProperties: string[], // This array contains all property names that changed in this export
    }) => void)

    parsingEmitter.on('channelClosed|channelOpened', ({
      chIndex: number,
      actor: Actor,
      globalData: GlobalData,
      result: Object,
      states: Object,
      setFastForward: (time: number) => void, // with this property can be fastforwarded through the replay
      endParsing: () => void, // calling this function stops the parsing of thr replay after the chunk
    }) => void)

    parsingEmitter.on('nextChunk', ({
      size: number, // size of the next chunk
      type: number, // type of the next chunk
      setFastForward: (time: number) => void, // with this property can be fastforwarded through the replay
      endParsing: () => void, // calling this function stops the parsing of thr replay after the chunk
    }) => void)
  }
};
```

## More Help
If you need help adding your own exports or want to know how replays work, check out this [Discord server](https://discord.gg/JC7snXQw35)
