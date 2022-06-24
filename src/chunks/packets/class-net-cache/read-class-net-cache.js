const receiveCustomProperty = require("../receive-custom-property");
const receiveProperties = require("../receive-properties");
const netDeltaSerialize = require("./net-delta-serialize");
const readFieldHeader = require("./read-field-header");

const readClassNetCache = (archive, bunch, staticActorId, classNetCache, globalData) => {
  while (true) {
    const result = readFieldHeader(archive, classNetCache);

    if (!result) {
      break;
    }

    const { outField: fieldCache, numPayloadBits } = result;

    if (!fieldCache || fieldCache.incompatible) {
      archive.skipBits(numPayloadBits);

      continue;
    }

    archive.addOffset(5, numPayloadBits);

    if (fieldCache.parseType === 'function') {
      const exportGroup = globalData.netGuidCache.GetNetFieldExportGroupString(
        fieldCache.type,
      );

      if (!exportGroup) {
        archive.popOffset(5);

        return false;
      }

      receiveProperties(archive, exportGroup, bunch, true, false, globalData, staticActorId);

      if (!archive.atEnd()) {
        archive.popOffset(5);

        return false;
      }
    }

    if (fieldCache.parseType === 'class') {
      if (
        !receiveCustomProperty(
          archive,
          fieldCache,
          bunch,
          classNetCache.pathName,
          globalData,
          staticActorId,
        )
      ) {
        archive.popOffset(5);

        continue;
      }
    }

    if (fieldCache.parseType === 'netDeltaSerialize') {
      const exportGroup = globalData.netGuidCache.GetNetFieldExportGroupString(
        fieldCache.type,
      );

      if (!exportGroup) {
        archive.popOffset(5);

        if (globalData.debug) {
          console.error(`class net cache ${fieldCache.name} from ${classNetCache.pathName} has been declared but has no export group`);
        }

        continue;
      }

      if (!globalData.netFieldParser.willReadType(exportGroup.pathName)) {
        archive.popOffset(5);

        continue;
      }

      if (
        netDeltaSerialize(
          archive,
          exportGroup,
          bunch,
          fieldCache.EnablePropertyChecksum || false,
          globalData,
          staticActorId,
        )
      ) {
        archive.popOffset(5);

        continue;
      }
    }

    archive.popOffset(5);
  }
};

module.exports = readClassNetCache;
