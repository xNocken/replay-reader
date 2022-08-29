import { Logger } from '../../../Classes/Logger';
import Replay from '../../../Classes/Replay';

const parsePlayer = (replay: Replay, logger: Logger): string | null => {
  const playerType = replay.readByte();

  switch (playerType) {
    case 3:
      return "bot";

    case 16:
      return replay.readString();

    case 17:
      replay.skipBytes(1);

      return replay.readId();

    default:
      logger.warn(`Invalid playerType ${playerType} while reading event`);

      return null;
  }
};

export default parsePlayer;
