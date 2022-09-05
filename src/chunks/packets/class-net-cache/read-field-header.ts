import { NetFieldExportGroupInternal } from "../../../../types/replay";
import Replay from "../../../Classes/Replay";

export const readFieldHeader = (archive: Replay, group: NetFieldExportGroupInternal) => {
  if (archive.atEnd()) {
    return null;
  }

  const netFieldExportHandle = archive.readSerializedInt(Math.max(group.netFieldExportsLength, 2));
  const numPayloadBits = archive.readIntPacked();

  const outField = group.netFieldExports[netFieldExportHandle];

  if (archive.isError || !archive.canRead(numPayloadBits)) {
    return null;
  }

  return {
    numPayloadBits,
    outField,
  };
};
