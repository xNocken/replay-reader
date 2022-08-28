import { NetworkGUID } from '../../Classes/NetworkGUID';

export const getFullGuidPath = (guid: NetworkGUID): string | null => {
  if (!guid) {
    return null;
  }

  if (guid.outer) {
    return `${getFullGuidPath(guid.outer)}.${guid.path}`;
  }

  return guid.path || null;
};
