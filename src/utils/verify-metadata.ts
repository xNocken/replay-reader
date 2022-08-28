import { MetaDataResult } from "$types/lib";

export const verifyMetadata = (metadata: MetaDataResult) => metadata
  && metadata.Events
  && metadata.DataChunks
  && metadata.Checkpoints
  && metadata.DownloadLink;
