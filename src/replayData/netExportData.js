const readNetExportGuids = require('./readNetExportGuids');
const readNetFieldExports = require('./readNetFieldExports');

const readExportData = (replay, globalData) => {
  readNetFieldExports(replay, globalData);
  readNetExportGuids(replay, globalData);
};

module.exports = readExportData;
