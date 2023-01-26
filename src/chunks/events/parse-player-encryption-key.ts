import type GlobalData from '../../Classes/GlobalData';
import type Replay from '../../Classes/Replay';

export const parsePlayerEncryptionKey =  (globalData: GlobalData, replay: Replay) => {
  globalData.playerStateEncryptionKey = Buffer.from(replay.readBytes(32));
};
