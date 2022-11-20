import Replay from '../src/Classes/Replay';

export class FDateTime {
  time: Date;

  serialize(reader: Replay) {
    this.time = reader.readDate();
  }

  toJSON() {
    return this.time.toISOString();
  }
}
