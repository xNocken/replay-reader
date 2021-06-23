class FGameplayTag {
  tagIndex;
  tagName;

  constructor (reader) {
    this.serialize(reader);
  }

  serialize(reader) {
    this.tagIndex = reader.readIntPacked();
  }

  resolve(cache) {
    this.tagName = cache.tryGetTagName(this.tagIndex);
  }

  toJSON() {
    return this.tagName;
  }
}

module.exports = FGameplayTag;
