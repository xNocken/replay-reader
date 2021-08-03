const DataBunch = require('../Classes/DataBunch');
const Replay = require('../Classes/Replay');
const readContentBlockHeader = require('./readContentBlockHeader');

/**
 *
 * @param {DataBunch} bunch
 */
const readContentBlockPayload = (bunch, globalData) => {
  let { repObject, bOutHasRepLayout, bObjectDeleted, subObjectInfo } = readContentBlockHeader(bunch, globalData);

  if (bObjectDeleted) {
    return {
      repObject,
      bOutHasRepLayout,
      bObjectDeleted,
      numPayloadBits: 0,
      subObjectInfo,
    };
  }

  const numPayloadBits = bunch.archive.readIntPacked();

  return {
    repObject,
    bOutHasRepLayout,
    bObjectDeleted,
    numPayloadBits,
    subObjectInfo,
  };
}

module.exports = readContentBlockPayload;
