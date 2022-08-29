import { Logs } from "$types/lib";

export class Logger {
  logs: Logs = {
    message: [],
    warn: [],
    error: [],
  };
  logToConsole: boolean;

  constructor(logToConsole: boolean) {
    this.logToConsole = logToConsole;
  }

  log(severity: keyof Logs, message: string) {
    this.logs[severity].push(message);

    if (this.logToConsole) {
      switch (severity) {
        case 'message':
          console.log(message);
          break;

        case 'warn':
          console.warn(message);
          break;

        case 'error':
          console.error(message);
          break;
      }
    }
  }

  message(message: string) {
    this.log('message', message);
  }

  warn(message: string) {
    this.log('warn', message);
  }

  error(message: string) {
    this.log('error', message);
  }
}
