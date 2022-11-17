import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';

export const parseZoneUpdate = (globalData: GlobalData, replay: Replay) => {
  globalData.eventData.safeZones.push({
    ...replay.readVector3d(),
    radius: replay.readFloat32(),
  });
}
