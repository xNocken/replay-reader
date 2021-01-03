const FVector = require('../Classes/FVector');
const NetBitReader = require('../Classes/NetBitReader');

/**
 * @param {NetBitReader} archive
 * @param {FVector} defaultVector
 */
const conditionallySerializeQuantizedVector = (archive, defaultVector) => {
  const bWasSerialized = archive.readBit();

  if (bWasSerialized) {
    const bShouldQuantize = (archive.header.EngineNetworkVersion < 13 ? true : archive.readBit())

    return bShouldQuantize ? archive.readPackedVector(10, 24) : archive.readVector();
  }

  return defaultVector;
}

module.exports = conditionallySerializeQuantizedVector;
