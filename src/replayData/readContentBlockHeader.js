const DataBunch = require("../Classes/DataBunch");
const internalLoadObject = require("./internalLoadObject");

/**
 * @param {DataBunch} bunch
 */
const readContentBlockHeader = (bunch, globalData) => {
  let bObjectDeleted = false;
  const bOutHasRepLayout = bunch.archive.readBit();
  const bIsActor = bunch.archive.readBit();
  const actor = globalData.channels[bunch.chIndex].actor;
  const subObjectInfo = {
    bHasRepLayout: bOutHasRepLayout,
    bIsActor,
  };

  if (bIsActor) {
    return {
      bObjectDeleted,
      bOutHasRepLayout,
      repObject: actor.archetype?.value || actor.actorNetGUID.value,
      bIsActor,
      subObjectInfo,
    }
  }

  const netGuid = internalLoadObject(bunch.archive, false, globalData);

  const bStablyNamed = bunch.archive.readBit();

  subObjectInfo.netGuid = netGuid;
  subObjectInfo.bStablyNamed = bStablyNamed;

  if (bStablyNamed) {
    return {
      bObjectDeleted,
      bOutHasRepLayout,
      repObject: netGuid.value,
      subObjectInfo,
    }
  }

  const classNetGUID = internalLoadObject(bunch.archive, false, globalData);

  subObjectInfo.classNetGUID = classNetGUID;

  if (classNetGUID == null || !classNetGUID.isValid()) {
    bObjectDeleted = true;

    return {
      bObjectDeleted,
      bOutHasRepLayout,
      repObject: netGuid.value,
      subObjectInfo,
    }
  }

  if (bunch.archive.header.EngineNetworkVersion >= 18) {
    const bActorIsOuter = bunch.archive.readBit();
    subObjectInfo.bActorIsOuter = bActorIsOuter;

    if (!bActorIsOuter) {
      subObjectInfo.innerActor = internalLoadObject(bunch.archive, false, globalData);
    }
  }

  return {
    bObjectDeleted,
    bOutHasRepLayout,
    repObject: classNetGUID.value,
    subObjectInfo,
  }
};

module.exports = readContentBlockHeader;
