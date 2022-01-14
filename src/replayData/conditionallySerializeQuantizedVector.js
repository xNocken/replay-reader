const FVector = require('../Classes/FVector');
const Replay = require('../Classes/Replay');

/**
 * @param {Replay} archive
 * @param {FVector} defaultVector
 *
 * @returns {FVector}
 */
const conditionallySerializeQuantizedVector = (archive, defaultVector) => {
  const bWasSerialized = archive.readBit();

  if (bWasSerialized) {
    const bShouldQuantize = (archive.header.engineNetworkVersion < 13) || archive.readBit()

    return bShouldQuantize ? archive.readPackedVector(10, 24) : archive.readVector();
  }

  return defaultVector;
}

module.exports = conditionallySerializeQuantizedVector;
