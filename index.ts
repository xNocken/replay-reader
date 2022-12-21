import fs from 'fs';


import GlobalData from './src/Classes/GlobalData';

import Replay from './src/Classes/Replay';
import replayChunks from './src/get-chunks-binary';
import parseChunks from './src/parse-chunks-binary';
import { replayMetaStreaming, replayChunksStreaming } from './src/get-chunks-streaming';
import { verifyMetadata } from './src/utils/verify-metadata';
import { parseMeta } from './src/chunks/parse-meta';
import { parseChunksStreaming } from './src/parse-chunks-streaming';
import { DefaultResult } from './types/result-data';
import { ParseOptions, ParseStreamOptions, MetaDataResult, BaseResult, FinishedExport, BaseStates } from './types/lib';

const debugStuff = (globalData: GlobalData) => {
  fs.writeFileSync('debug-netGuidToPathName.txt', globalData.debugNetGuidToPathName.map(({ path, value, outer }) => `${path}: ${value} -> ${outer?.value}`).join('\n'));
  fs.writeFileSync('debug-notReadNFE.txt', Object.values(globalData.debugNotReadingGroups).map(({ pathName, properties }) => `${pathName}:\n${Object.values(properties).map(({ name, handle }) => `  ${name}: ${handle}`).join('\n')}`).join('\n\n'));
  fs.writeFileSync('debug-readNFE.txt', Object.values(globalData.netGuidCache.netFieldExportGroupMap).map(({ pathName, netFieldExports }) => `${pathName}:\n${Object.values(netFieldExports).map(({ name, handle }) => `  ${name}: ${handle}`).join('\n')}`).join('\n\n'));
};

const initGlobalData = (options: ParseStreamOptions | ParseOptions) => {
  const globalData = new GlobalData(options || {});

  globalData.options.setEvents({
    properties: globalData.emitters.properties,
    functionCall: globalData.emitters.functionCall,
    actorSpawn: globalData.emitters.actorSpawn,
    actorDespawn: globalData.emitters.actorDespawn,
    netDelta: globalData.emitters.netDelta,
    parsing: globalData.emitters.parsing,
  }, globalData);

  return globalData;
};

export const parseBinary = <ResultType extends BaseResult = DefaultResult>(data: Buffer, options: ParseOptions): ResultType => {
  const globalData = initGlobalData(options);
  const replay = new Replay(data, globalData);

  const meta = parseMeta(replay, globalData);
  const chunks = replayChunks(replay, globalData);

  globalData.result.meta = meta;
  globalData.result.header = globalData.header;

  if (globalData.options.exportChunks) {
    globalData.result.chunks = chunks;
  }

  parseChunks(replay, chunks, globalData);

  if (globalData.options.parseEvents) {
    globalData.result.events = {
      chests: globalData.eventData.chests,
      safeZones: globalData.eventData.safeZones,
      players: Object.values(globalData.eventData.players),
      matchStats: globalData.eventData.matchStats,
      gfp: globalData.eventData.gfp,
    };
  }

  const finishedData: FinishedExport<ResultType, BaseStates> = {
    result: <ResultType>globalData.result,
    states: globalData.states,
    globalData: globalData,
    logger: globalData.logger,
  };

  globalData.emitters.parsing.emit('finished', finishedData);

  if (globalData.options.debug) {
    debugStuff(globalData);
  }

  if (!globalData.header) {
    throw new Error('No header found');
  }

  return {
    ...<ResultType>globalData.result,
    logs: globalData.logger.logs,
  };
};

export const parseStreaming = async <ResultType extends BaseResult = DefaultResult>(metadata: MetaDataResult, options: ParseStreamOptions): Promise<ResultType> => {
  const globalData = initGlobalData(options);

  if (!verifyMetadata(metadata)) {
    throw new Error('The data provided is not a valid metadata file');
  }

  const meta = replayMetaStreaming(metadata, globalData);
  const chunks = await replayChunksStreaming(metadata, globalData);

  globalData.result.meta = meta;
  globalData.result.header = globalData.header;

  if (globalData.options.exportChunks) {
    globalData.result.chunks = chunks;
  }

  await parseChunksStreaming(chunks, globalData);

  if (globalData.options.parseEvents) {
    globalData.result.events = {
      chests: globalData.eventData.chests,
      safeZones: globalData.eventData.safeZones,
      players: Object.values(globalData.eventData.players),
      matchStats: globalData.eventData.matchStats,
      gfp: globalData.eventData.gfp,
    };
  }

  if (globalData.options.debug) {
    debugStuff(globalData);
  }

  return <ResultType>{
    ...globalData.result,
    logs: globalData.logger.logs,
  };
};
