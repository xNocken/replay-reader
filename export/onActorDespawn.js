const handleChest = require("./actorDespawn/handleChest");

const onActorDespawn = (isOpenPacket, chIndex, timeSeconds, exportGroup, mapObjectName, globalData) => {
  switch(exportGroup.pathName) {
    case '/Game/Building/ActorBlueprints/Containers/Tiered_Chest_Athena.Tiered_Chest_Athena_C':
        handleChest(mapObjectName, chIndex, globalData)

      break;

    default:
      if (globalData.debug) {
        console.log('Unhandled onActorDespawn', exportGroup.pathName);
      }
  }
};

module.exports = onActorDespawn;
