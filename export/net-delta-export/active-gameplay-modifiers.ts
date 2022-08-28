import { NetDeltaExportFunction } from '$types/lib';
import { ActiveGampeplayModifiersExport, DefaultResult, DefaultStates } from '$types/result-data';

export const handleActiveGameplayModifiers: NetDeltaExportFunction<DefaultResult, DefaultStates, ActiveGampeplayModifiersExport> = ({ data, result }) => {
  result.gameData.activeGameplayModifiers.push(data.export.ModifierDef?.name);
};

