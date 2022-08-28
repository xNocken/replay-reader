import { CustomClass } from '$types/lib';
import Replay from "../src/Classes/Replay";

export class NetworkGUID  {
  value: number;
  checksum?: number;
  outer?: NetworkGUID;
  flags?: number;
  path?: string;

  constructor(value?: number) {
    this.value = value || 0;
  }

  isValid() {
    return this.value > 0;
  }

  isDynamic() {
    return this.value > 0 && (this.value & 1) != 1;
  }

  isDefault() {
    return this.value == 1;
  }

  serialize(reader: Replay) {
    this.value = reader.readIntPacked();
  }
}
