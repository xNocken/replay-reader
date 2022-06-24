const verifyMetadata = (metadata) => metadata
  && metadata.Events
  && metadata.DataChunks
  && metadata.Checkpoints
  && metadata.DownloadLink;

module.exports = verifyMetadata;
