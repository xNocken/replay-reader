import type GlobalData from '../src/Classes/GlobalData';
import type Replay from '../src/Classes/Replay';
import type { CustomClass } from '../types/lib';

export class FAthenaPawnReplayData implements CustomClass {
  health: number;
  shield: number;

  serialize(reader: Replay, globalData: GlobalData) {
    const length = reader.readUInt32();

    if (!length) {
      return;
    }

    const encryptedPlayerData = reader.decryptBuffer(length, globalData.playerStateEncryptionKey);

    this.health = encryptedPlayerData.readFloat32();
    this.shield = encryptedPlayerData.readFloat32();
  }
}
