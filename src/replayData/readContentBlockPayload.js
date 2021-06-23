const DataBunch = require('../Classes/DataBunch');
const Replay = require('../Classes/Replay');
const readContentBlockHeader = require('./readContentBlockHeader');

/**
 *
 * @param {DataBunch} bunch
 */
const readContentBlockPayload = (bunch, globalData) => {
  let { repObject, bOutHasRepLayout, bObjectDeleted } = readContentBlockHeader(bunch, globalData);

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
  };
}

module.exports = readContentBlockPayload;
