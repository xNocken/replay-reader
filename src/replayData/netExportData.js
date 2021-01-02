const Replay = require('../Classes/Replay');
const readNetExportGuids = require('./readNetExportGuids');
const readNetFieldExports = require('./readNetFieldExports');

/**
 * Read the export data :D
 * @param {Replay} replay the replay
 */
const readExportData = (replay) => {
  readNetFieldExports(replay);
  readNetExportGuids(replay);
};

module.exports = readExportData;
