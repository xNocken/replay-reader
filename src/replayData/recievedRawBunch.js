const DataBunch = require("../Classes/DataBunch");
const recievedNextBunch = require("./recievedNextBunch");

/**
 * @param {DataBunch} bunch
 */
const recievedRawBunch = (bunch) => {
  recievedNextBunch(bunch);
};

module.exports = recievedRawBunch;
