const DataBunch = require("../Classes/DataBunch");
const recieveNetGUIDBunch = require("./recieveNetGUIDBunch");

/**
 * @param {DataBunch} bunch
 */
const recievedRawBunch = (bunch) => {
  recievedNextBunch(bunch);
};

module.exports = recievedRawBunch;
