import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';

export const parseTimecode = (globalData: GlobalData, replay: Replay) => {
  globalData.eventData.timecode = replay.readDate();
};
