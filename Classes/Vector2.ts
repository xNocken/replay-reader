import Replay from '../src/Classes/Replay';

export class Vector2 {
  x: number;
  y: number;

  serialize(reader: Replay) {
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