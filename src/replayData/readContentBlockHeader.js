const DataBunch = require("../Classes/DataBunch");
const { channels } = require("../utils/globalData");
const internalLoadObject = require("./internalLoadObject");

/**
 * @param {DataBunch} bunch
 */
const readContentBlockHeader = (bunch) => {
  let bObjectDeleted = false;
  const bOutHasRepLayout = bunch.archive.readBit();
  const bIsActor = bunch.archive.readBit();

  if (bIsActor) {
    return {
      bObjectDeleted,
      bOutHasRepLayout,
      repObject: channels[bunch.chIndex].actor.archetype?.value || channels[bunch.chIndex].actor.actorNetGUID.value,
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
