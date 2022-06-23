const readContentBlockHeader = require('./readContentBlockHeader');

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
