const DataBunch = require("../Classes/DataBunch");
const internalLoadObject = require("./internalLoadObject");

/**
 * @param {DataBunch} bunch
 */
const readContentBlockHeader = (bunch, globalData) => {
  let bObjectDeleted = false;
  const bOutHasRepLayout = bunch.archive.readBit();
  const bIsActor = bunch.archive.readBit();

  if (bIsActor) {
    return {
      bObjectDeleted,
      bOutHasRepLayout,
      repObject: globalData.channels[bunch.chIndex].actor.archetype?.value || globalData.channels[bunch.chIndex].actor.actorNetGUID.value,
    }
  }

  const netGuid = internalLoadObject(bunch.archive, false);

  const bStablyNamed = bunch.archive.readBit();

  if (bStablyNamed) {
    return {
      bObjectDeleted,
      bOutHasRepLayout,
      repObject: netGuid.value,
    }
  }

  const classNetGUID = internalLoadObject(bunch.archive, false);

  if (classNetGUID == null || !classNetGUID.isValid()) {
    bObjectDeleted = true;
  }

  return {
    bObjectDeleted,
    bOutHasRepLayout,
    repObject: classNetGUID.Value,
  }
};

module.exports = readContentBlockHeader;
