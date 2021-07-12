declare module 'fortnite-replay-parser';

interface parseOptions {
  parseLevel?: number,
  debug?: boolean,
  onExportRead?: () => {},
  onChannelOpened?: () => {},
  onChannelClosed?: () => {},
  netFieldExportPath?: () => {},
  onlyUseCustomNetFieldExports?: boolean,
  customClassPath?: string,
  customEnumPath?: string,
  onNetDeltaRead?: () => {},
}

declare function parse(buffer: Buffer, options?: parseOptions): Promise<object>;

export = parse;
