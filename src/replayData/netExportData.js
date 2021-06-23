const Replay = require('../Classes/Replay');
const readNetExportGuids = require('./readNetExportGuids');
const readNetFieldExports = require('./readNetFieldExports');

/**
 * Read the export data :D
 * @param {Replay} replay the replay
 */
const readExportData = (replay, globalData) => {
  readNetFieldExports(replay, globalData);
  readNetExportGuids(replay, globalData);
};

module.exports = readExportData;
