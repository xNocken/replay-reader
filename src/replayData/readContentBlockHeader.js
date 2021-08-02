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

  if (bIsActor) {
    return {
      bObjectDeleted,
      bOutHasRepLayout,
      repObject: actor.archetype?.value || actor.actorNetGUID.value,
    }
  }

  const netGuid = internalLoadObject(bunch.archive, false, globalData);

  const bStablyNamed = bunch.archive.readBit();

  if (bStablyNamed) {
    return {
      bObjectDeleted,
      bOutHasRepLayout,
      repObject: netGuid.value,
    }
  }

  const classNetGUID = internalLoadObject(bunch.archive, false, globalData);

  if (classNetGUID == null || !classNetGUID.isValid()) {
    bObjectDeleted = true;

    return {
      bObjectDeleted,
      bOutHasRepLayout,
      repObject: netGuid.value,
    }
  }

  if (bunch.archive.header.EngineNetworkVersion >= 18) {
    const bActorIsOuter = bunch.archive.readBit();

    if (!bActorIsOuter) {
      internalLoadObject(bunch.archive, false, globalData);
    }
  }

  return {
    bObjectDeleted,
    bOutHasRepLayout,
    repObject: classNetGUID.value,
  }
};

module.exports = readContentBlockHeader;
