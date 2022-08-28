import Replay from '../src/Classes/Replay';

export class FName {
  name: string;

  serialize(reader: Replay) {
    this.name = reader.readFName();
  }

  toJSON() {
    return this.name;
  }
}
