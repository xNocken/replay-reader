import { PropertyExportFunction } from "$types/lib";
import { DefaultResult, DefaultStates, SafeZone } from "$types/result-data";

export const handleSafezoneIndicatorFastForwarding: PropertyExportFunction<DefaultResult, DefaultStates, SafeZone> = ({ data, result, states, setFastForward }) => {
  if (data.SafeZoneFinishShrinkTime && states.safeZones.SafeZoneFinishShrinkTime !== data.SafeZoneFinishShrinkTime) {
    result.gameData.safeZones.push(data);
    states.safeZones.SafeZoneFinishShrinkTime = data.SafeZoneFinishShrinkTime;

    const realTime = data.SafeZoneFinishShrinkTime - states.gameState.ingameToReplayTimeDiff;

    setFastForward(realTime);
  }
};
