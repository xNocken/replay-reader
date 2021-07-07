const FGameplayTag = require("./FGameplayTag");

class FGameplayTagContainer {
  tags = [];

  serialize(reader) {
    if (reader.readBit()) {
      return;
    }

    const numTags = reader.readBitsToInt(7);

    for (let i = 0; i < numTags; i++) {
      this.tags[i] = new FGameplayTag(reader);
    }
  }

  resolve(cache) {
    if (!this.tags.length) {
      return;
    }

    this.tags.forEach((tag) => {
      tag.resolve(cache);
    });
  }

  toJSON() {
    return this.tags || null;
  }
}

module.exports = FGameplayTagContainer;
