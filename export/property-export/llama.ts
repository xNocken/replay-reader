import { PropertyExportFunction } from '../../types/lib'
import { DefaultResult, DefaultStates, LlamaExport } from '../../types/result-data';

type LlamaRecord = Record<keyof LlamaExport, LlamaExport[keyof LlamaExport]>;

export const handleLlama: PropertyExportFunction<DefaultResult, DefaultStates, LlamaExport> = ({ actorId, data, result, states, changedProperties }) => {
  let llama = states.llamas[actorId];

  if (!llama) {
    llama = {};

    result.mapData.llamas.push(llama);
    states.llamas[actorId] = llama;
  }

  for (let i = 0; i < changedProperties.length; i += 1) {
    const key = changedProperties[i];

    (llama as LlamaRecord)[key] = data[key];
  }
};
