const DataBunch = require('../Classes/DataBunch');
const NetBitReader = require('../Classes/NetBitReader');
const readContentBlockHeader = require('./readContentBlockHeader');

/**
 *
 * @param {DataBunch} bunch
 */
const readContentBlockPayload = (bunch, globalData) => {
  let reader = null;

  let { repObject, bOutHasRepLayout, bObjectDeleted } = readContentBlockHeader(bunch, globalData);

  if (bObjectDeleted) {
    return {
      repObject,
      bOutHasRepLayout,
      bObjectDeleted,
      reader
    };
  }

  const numPayloadBits = bunch.archive.readIntPacked();

  reader = new NetBitReader(bunch.archive.readBits(numPayloadBits), numPayloadBits);
  reader.header = bunch.archive.header;
  reader.info = bunch.archive.info;

  return {
    repObject,
    bOutHasRepLayout,
    bObjectDeleted,
    reader
  };
}

module.exports = readContentBlockPayload;
