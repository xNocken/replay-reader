import Replay from '../src/Classes/Replay';

export class FAthenaPawnReplayData {
  encryptedPlayerData: Uint8Array;

  serialize(reader: Replay) {
    const length = reader.readUInt32();

    this.encryptedPlayerData = reader.readBytes(length);
  }
}
