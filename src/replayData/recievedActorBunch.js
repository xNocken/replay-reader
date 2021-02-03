const DataBunch = require("../Classes/DataBunch");
const processBunch = require("./processBunch");

/**
 *
 * @param {DataBunch} bunch
 */
const recievedActorBunch = (bunch) => {
  if (bunch.bHasMustBeMappedGUIDs) {
    const numMusteBeMappedGUIDs = bunch.archive.readUInt16();

    for (let i = 0; i < numMusteBeMappedGUIDs; i++) {
      const guid = bunch.archive.readIntPacked();
    }
  }

  if (bunch.archive.lastBit === 48514) {
    console;
  }

  processBunch(bunch);
};

module.exports = recievedActorBunch;
