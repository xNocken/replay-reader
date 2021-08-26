# Add own exports

## What should I know about replays?
Replays use so called netFieldExports to parse thier packets. The replays delivers the information about what part of the replay is which property and we deliver the information on how to parse them. There are 2 types of netFieldExports. The first is just the properties. The other one is the ClassNetCache and is used to to get more advanced data (custom struct), call functions and add or remove items from lists. Packets only contain the data that has changed.

## Where can I find the properties of a object?
You can use the debug mode to generate a list of every object that is in the replay.

## Create a custom netFieldExport
The first thing is to decide what kind of data you want to parse. Most likely you want to parse a normal property like the kills of a player. The other ones are pretty rare and will be explained later.

Next step is to figure out where this property is stored. For example if you want to find the radius of the current storm, you would need to go in the ```netfieldexports.txt``` and try to find it. So storm also known as safezone. if you search for safezone you find the export ```/Game/Athena/SafeZone/SafeZoneIndicator.SafeZoneIndicator_C```. The string is also the path for this object. This object has the property ```Radius```. 

Now that you know the Object and property you want to parse we can start with creating the file. Create a new folder for your netFieldExports and set the ```netFieldExportPath``` setting and create a new json file. For examle ```SafeZoneIndicator.json```. The structure can be found [here](#netfieldexport-structure). 

Now follow these steps:
- Add the path to the path array
- Set the parseLevel to something
- Add a property with the exact name
- Add the right [parseFunction](#netfieldexport-parsefunctions)
- Add the config for the property

The next step is to handle the exported data. 

## Create a custom export function 
First step: Create a function like [this](#export-function) and add it to the ```onExportRead``` setting. The easiest way to structure this is to add a switch in this file and call the functions as seen here:
```js
const onExportRead = (chIndex, value, timeseconds, staticActorId, globalData) => {
  switch (value.type) {
    case 'SafeZoneIndicator.SafeZoneIndicator_C':
      handleSafezone(value, globalData);
      break;

    default:
      console.log('Unhandled export:', value.type)
      break;
  }
};
```

Globaldata contains an object called ```result```. All data handled by the function should be added to this object because this object gets returned after the parsing is done. An example for handling data could be this: 

```js
const handleSafezone = (info, globalData) => {
  if (info.SafeZoneStartShrinkTime && info.SafeZoneFinishShrinkTime) {
    globalData.result.gameData.safeZones.push(info);
  }
};
```

But keep in mind that you only get data that changed. Heres another way to handle this problem:
```js
const handleSupplyDrop = (chIndex, supplyDrop, globalData) => {
  if (!globalData.supplyDrops[chIndex]) {
    globalData.supplyDrops[chIndex] = supplyDrop;
    globalData.result.mapData.supplyDrops.push(supplyDrop);

    return;
  }

  Object.entries(supplyDrop).forEach(([key, value]) => {
    if (value !== null) {
      globalData.supplyDrops[chIndex][key] = value;
    }
  });
};
```

You maybe noticed that i added the object to ```globaldata.supplyDrops``` and ```globalData.result```. Thats because i need a quick way to access them thats why i store them in an object with thier chIndex. But when i use the data after its parsed i want the data as an array and not as an object.

I currently dont have a good way to add objects that can be used to index them with chIndex or add a array for the exported data. Thats why i currently use a workaround to check if the object has been created on the first call and if not create it.

## Troubleshooting
You've gone through all this effort and nothing works. This can have multiple reasons. 
- [The data you're trying to parse is Part of a classNetCache](#class-net-cache-parsing)
- [The object you're trying to parse is Part of the map](#map-object-parsing)
- The object is something extremly special and needs needs to be parsed in a weird way

## Parse classNetCache <a name="class-net-cache-parsing"></a>
TODO

## Parse MapObject<a name="map-object-parsing"></a>
A mapObject is every object thats not created by the server. This includes chests, walls of buildings, minigames like soccer and much more. To make them parsable all you need to do is find thier map name. Just take the export path for example ```/Game/Building/ActorBlueprints/Containers/Tiered_Chest_Athena.Tiered_Chest_Athena_C``` and search for the name in ```netGuidToPathName.txt```. In this case the name is ```Tiered_Chest_Athena``` and the staticActorId is ```Tiered_Chest_Athena66```, ```Tiered_Chest_Athena64_1``` and ```Tiered_Chest_Athena_1```. Now go to your netFieldExport and add the setting ```staticActorId``` and add a regex that matches that. 

I reccomend switching from chIndex to store them to using the staticActorId. chIndex seems to be inconsistent with mapObjects and the staticActorId is the same accross all replays in one version.

## NetFieldExport structure <a name="netfieldexport-structure"></a>
```json
{
  "path": Array<string>,
  "parseLevel": number,
  "type": ?string,
  "parseUnknownHandles": ?boolean,
  "redirects": ?Array<string>,
  "customExportName": ?string, // this overrides the type property on the export
  "properties": {
    "string": {
      "name": string, // same as the name of the object
      "parseFunction": string,
      "type": ?string,
      "args": ?Array<any>,
      "config": ?Object<any>,
      "bits": ?number
    }
  }
}
```

## Parse Functions <a name="netfieldexport-parsefunctions"></a>
The parse functions decide how a property is parsed. Different functions require different arguments.

### ignore
this function ignores the property
- name: ignore
- returns: nothing
- size: 0 bit
- options required: none

### readBit
- name: readBit
- returns: boolean
- size: 1 bit
- options required: none

### readIntPacked
- name: readBit
- returns: number
- size: 1 to infinity bytes
- options required: none

### readInt64
- name: readInt64
- returns: number
- size: 8 bytes
- options required: none

### readInt32
- name: readInt32
- returns: number
- size: 4 bytes
- options required: none

### readInt16
- name: readInt16
- returns: number
- size: 2 bytes
- options required: none

### readByte
- name: readByte
- returns: number
- size: 1 byte
- options required: none

### readClass
This function parses the data as a class. 

The ```type``` option needs to be the exact class filename without extention
- name: readClass
- returns: Class
- size: unknown
- options required: type

### readDynamicArray
This function parses the data as a classs in an array. 

The ```type``` option needs to be the exact class filename without extention or a parseFunction
- name: readDynamicArray
- returns: Array\<any\>
- size: unknown
- options required: type

### readEnum
This function parses the data as a enum. 

The ```type``` option needs to be the exact enum filename without extention.

The ```bits``` option is the size of the enum in bits.
- name: readEnum
- returns: Array\<any\>
- size: unknown
- options required: type, bits

### readNetId
- name: readNetId
- returns: string
- size: 32
- options required: none

### readString
- name: readString
- returns: string
- size: unknown
- options required: none


## Export functions <a name="export-function"></a>
### onExportRead
```js
const onExportRead = (
  chIndex, // This can be seen as the unique identifier for a object
  value, // The value contains the changed values. It has two consistant properties. Type: this is the type of the export. Path: this is the full exportPath of the object
  timeseconds, // This is the time in seconds since the replay started recording
  staticActorId, // This is the name of an actor thats placed on the map. Its unique across replays
  globalData, // this is a class with all data. The most important is the result object. This is what gets returned after the parsing is done
) => {
  switch (value.type) {
    case 'SafeZoneIndicator.SafeZoneIndicator_C':
      handleSafezone(value, globalData);
      break;

    default:
      console.log('Unhandled export:', value.type)
      break;
  }
};
```

## More Help
If you need help adding own exports or wanna know how replays work check out this [discord server](https://discord.gg/JC7snXQw35)
