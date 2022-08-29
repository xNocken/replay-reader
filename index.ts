import fs from 'fs';

import { ParseOptions, ParseStreamOptions, MetaDataResult, BaseResult, BaseStates } from '$types/lib';

import GlobalData from './src/Classes/GlobalData';

import Replay from './src/Classes/Replay';
import replayChunks from './src/get-chunks-binary';
import parseChunks from './src/parse-chunks-binary';
import { replayMetaStreaming, replayChunksStreaming } from './src/get-chunks-streaming';
import { verifyMetadata } from './src/utils/verify-metadata';
import { parseMeta } from './src/chunks/parse-meta';
import { parseChunksStreaming } from './src/parse-chunks-streaming';
import { DefaultResult, DefaultStates } from '$types/result-data';

const debugStuff = <ResultType extends BaseResult>(globalData: GlobalData<ResultType>) => {
  fs.writeFileSync('debug-netGuidToPathName.txt', globalData.debugNetGuidToPathName.map(({ path, value, outer }) => `${path}: ${value} -> ${outer?.value}`).join('\n'));
  fs.writeFileSync('debug-notReadNFE.txt', Object.values(globalData.debugNotReadingGroups).map(({ pathName, properties }) => `${pathName}:\n${Object.values(properties).map(({ name, handle }) => `  ${name}: ${handle}`).join('\n')}`).join('\n\n'));
  fs.writeFileSync('debug-readNFE.txt', Object.values(globalData.netGuidCache.netFieldExportGroupMap).map(({ pathName, netFieldExports }) => `${pathName}:\n${Object.values(netFieldExports).map(({ name, handle }) => `  ${name}: ${handle}`).join('\n')}`).join('\n\n'));
};

const initGlobalData = <ResultType extends BaseResult>(options: ParseStreamOptions<ResultType> | ParseOptions<ResultType>) => {
  const globalData = new GlobalData<ResultType>(options || {});

  globalData.options.setEvents({
    properties: globalData.emitters.properties,
    actorSpawn: globalData.emitters.actorSpawn,
    actorDespawn: globalData.emitters.actorDespawn,
    netDelta: globalData.emitters.netDelta,
    parsing: globalData.emitters.parsing,
  }, globalData);

  return globalData;
};

export const parseBinary = <ResultType extends BaseResult = DefaultResult>(data: Buffer, options: ParseOptions<ResultType>): ResultType => {
  const globalData = initGlobalData<ResultType>(options);
  const replay = new Replay(data);

  const meta = parseMeta(replay, globalData);
  const chunks = replayChunks(replay, globalData);

  globalData.result.meta = meta;
  globalData.result.header = globalData.header;

  if (globalData.options.parseEvents) {
    globalData.result.events = {
      chests: globalData.eventData.chests,
      safeZones: globalData.eventData.safeZones,
      players: Object.values(globalData.eventData.players),
      matchStats: globalData.eventData.matchStats,
      gfp: globalData.eventData.gfp,
    };
  }

  if (globalData.options.exportChunks) {
    globalData.result.chunks = chunks;
  }

  parseChunks(replay, chunks, globalData);

  if (globalData.options.debug) {
    debugStuff(globalData);
  }

  if (!globalData.header) {
    throw new Error('No header found');
  }

  return {
    ...globalData.result,
    logs: globalData.logger.logs,
  };
};

export const parseStreaming = async <ResultType extends BaseResult = DefaultResult>(metadata: MetaDataResult, options: ParseStreamOptions<ResultType>) => {
  const globalData = initGlobalData(options);

  if (!verifyMetadata(metadata)) {
    throw new Error('The data provided is not a valid metadata file');
  }

  const meta = replayMetaStreaming(metadata, globalData);
  const chunks = await replayChunksStreaming(metadata, globalData);

  globalData.result.meta = meta;
  globalData.result.header = globalData.header;

  if (globalData.options.parseEvents) {
    globalData.result.events = {
      chests: globalData.eventData.chests,
      safeZones: globalData.eventData.safeZones,
      players: Object.values(globalData.eventData.players),
      matchStats: globalData.eventData.matchStats,
      gfp: globalData.eventData.gfp,
    };
  }

  if (globalData.options.exportChunks) {
    globalData.result.chunks = chunks;
  }

  await parseChunksStreaming(chunks, globalData);

  if (globalData.options.debug) {
    debugStuff(globalData);
  }

  return {
    ...globalData.result,
    logs: globalData.logger.logs,
  };
};
