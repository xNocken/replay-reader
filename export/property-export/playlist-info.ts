import { PropertyExportFunction } from '../../types/lib';
import { DefaultResult, DefaultStates, PlaylistInfoExport } from '../../types/result-data';

export const handlePlaylistInfo: PropertyExportFunction<DefaultResult, DefaultStates, PlaylistInfoExport> = ({ data, result }) => {
  result.gameData.playlistInfo = data.name;
};
