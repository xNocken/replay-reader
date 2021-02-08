const { pickups } = require("../../utils/globalData");

const handleFortPickup = (chIndex, data) => {
  if (!pickups[chIndex]) {
    pickups[chIndex] = data;
    return;
  }

  Object.entries(data).forEach(([key, value]) => {
    if (value) {
      pickups[chIndex][key] = value;
    }
  });
};

module.exports = handleFortPickup;
