const internalLoadObject = require("../../utils/read-net-guid");

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
      bIsActor,
    };
  }

  const netGuid = internalLoadObject(bunch.archive, false, globalData);

  const bStablyNamed = bunch.archive.readBit();

  if (bStablyNamed) {
    return {
      bObjectDeleted,
      bOutHasRepLayout,
      repObject: netGuid.value,
    };
  }

  const classNetGUID = internalLoadObject(bunch.archive, false, globalData);

  if (classNetGUID == null || !classNetGUID.isValid()) {
    bObjectDeleted = true;

    return {
      bObjectDeleted,
      bOutHasRepLayout,
      repObject: netGuid.value,
    };
  }

  if (bunch.archive.header.engineNetworkVersion >= 18) {
    const bActorIsOuter = bunch.archive.readBit();

    if (!bActorIsOuter) {
      internalLoadObject(bunch.archive, false, globalData);
    }
  }

  return {
    bObjectDeleted,
    bOutHasRepLayout,
    repObject: classNetGUID.value,
  };
};

const readContentBlockPayload = (bunch, globalData) => {
  let { repObject, bOutHasRepLayout, bObjectDeleted, bIsActor } = readContentBlockHeader(bunch, globalData);

  if (bObjectDeleted) {
    return {
      repObject,
      bOutHasRepLayout,
      bObjectDeleted,
      numPayloadBits: 0,
    };
  }

  const numPayloadBits = bunch.archive.readIntPacked();

  return {
    repObject,
    bOutHasRepLayout,
    bObjectDeleted,
    numPayloadBits,
    bIsActor,
  };
};

module.exports = readContentBlockPayload;
