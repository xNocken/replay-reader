const DataBunch = require("../Classes/DataBunch");
const processBunch = require("./processBunch");

/**
 *
 * @param {DataBunch} bunch
 */
const receivedActorBunch = (bunch, replay, globalData) => {
  if (bunch.bHasMustBeMappedGUIDs) {
    const numMusteBeMappedGUIDs = replay.readUInt16();

    for (let i = 0; i < numMusteBeMappedGUIDs; i++) {
      replay.readIntPacked();
    }
  }

  processBunch(bunch, replay, globalData);
};

module.exports = receivedActorBunch;
