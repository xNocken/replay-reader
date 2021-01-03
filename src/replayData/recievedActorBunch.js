const DataBunch = require("../Classes/DataBunch");
const processBunch = require("./processBunch");

/**
 *
 * @param {DataBunch} bunch
 */
const recievedActorBunch = (bunch) => {
  if (bunch.bHasMustBeMappedGUIDs) {
    const numMusteBeMappedGUIDs = bunch.archive.readUInt16();

    console.log();

    for (let i = 0; i < numMusteBeMappedGUIDs; i++) {
      const guid = bunch.archive.readIntPacked();
    }
  }

  processBunch(bunch);
};

module.exports = recievedActorBunch;
