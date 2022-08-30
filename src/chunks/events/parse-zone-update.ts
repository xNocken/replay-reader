import GlobalData from '../../Classes/GlobalData';
import Replay from '../../Classes/Replay';

export const parseZoneUpdate = (globalData: GlobalData, replay: Replay) => {
  globalData.eventData.safeZones.push({
    x: replay.readFloat32(),
    y: replay.readFloat32(),
    z: replay.readFloat32(),
    radius: replay.readFloat32(),
  });
}
