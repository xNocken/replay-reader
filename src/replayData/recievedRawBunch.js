const DataBunch = require("../Classes/DataBunch");
const recievedNextBunch = require("./recievedNextBunch");

/**
 * @param {DataBunch} bunch
 */
const recievedRawBunch = (bunch, globalData) => {
  recievedNextBunch(bunch, globalData);
};

module.exports = recievedRawBunch;
