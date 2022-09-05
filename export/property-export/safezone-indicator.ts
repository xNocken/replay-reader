import { PropertyExportFunction } from "../../types/lib";
import { DefaultResult, DefaultStates, SafeZone } from "../../types/result-data";

export const handleSafezoneIndicator: PropertyExportFunction<DefaultResult, DefaultStates, SafeZone> = ({ data, result, states }) => {
  if (
    data.SafeZoneFinishShrinkTime &&
    states.safeZones.SafeZoneFinishShrinkTime !== data.SafeZoneFinishShrinkTime
  ) {
    result.gameData.safeZones.push(data);
    states.safeZones.SafeZoneFinishShrinkTime = data.SafeZoneFinishShrinkTime;
  }
};
