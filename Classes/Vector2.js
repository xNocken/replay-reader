class Vector2 {
  serialize(reader) {
    this.x = reader.readFloat32();
    this.y = reader.readFloat32();
  }

  toJSON() {
    return {
      x: this.x,
      y: this.y,
    };
  }
}

module.exports = Vector2;
