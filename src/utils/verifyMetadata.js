const verifyMetadata = (metadata) => {
  return metadata
    && metadata.Events
    && metadata.DataChunks
    && metadata.Checkpoints
    && metadata.DownloadLink;
}

module.exports = verifyMetadata;
