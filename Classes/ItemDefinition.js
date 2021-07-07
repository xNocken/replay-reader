const NetGuidCache = require("../src/Classes/NetGuidCache");
const NetworkGUID = require("./NetworkGUID");

class ItemDefinition extends NetworkGUID {
  name;

  /**
   *
   * @param {NetGuidCache} cache
   */
  resolve(cache) {
    if (this.isValid()) {
      const name = cache.tryGetPathName(this.value);

      if (name) {
        this.name = name;
      }
    }
  }

  toJSON() {
    return this.name || null;
  }
}

module.exports = ItemDefinition;
