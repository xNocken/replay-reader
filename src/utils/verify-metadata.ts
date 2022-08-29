import { MetaDataResult } from "$types/lib";

export const verifyMetadata = (metadata: any): metadata is MetaDataResult => metadata
  && metadata.Events
  && metadata.DataChunks
  && metadata.Checkpoints
  && metadata.DownloadLink;
