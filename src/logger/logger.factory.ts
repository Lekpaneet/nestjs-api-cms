import 'winston-daily-rotate-file';
import { format, transports } from 'winston';
import {
  WinstonModule,
  utilities as nestWinstonModuleUtilities,
} from 'nest-winston';
import { Injectable, LoggerService } from '@nestjs/common';
import { DateTz } from '../commons/helpers/DateTz';

export interface ILoggerOptions {
  action: string;
  sessionId?: string;
  trace?: string;
}

@Injectable()
export class LoggerFactory implements LoggerService {
  private logger: LoggerService;
  private loggerGlobal!: any;

  constructor() {
    const appName = 'logger';
    const DEBUG = process.env.DEBUG;

    const pathFilename = (level: string, appName: string) => {
      return `logs/log_%DATE%/${level}-${appName}.log`;
    };

    const consoleFormat = format.combine(
      format.timestamp(),
      format.ms(),
      nestWinstonModuleUtilities.format.nestLike(appName, {
        colors: true,
        prettyPrint: true,
      }),
    );

    this.logger = WinstonModule.createLogger({
      level: DEBUG ? 'debug' : 'info',
      transports: [
        new transports.Console({
          format: consoleFormat,
        }),
        new transports.DailyRotateFile({
          level: 'info',
          filename: pathFilename('info', appName),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '90d',
        }),
        new transports.DailyRotateFile({
          level: 'error',
          filename: pathFilename('error', appName),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '120d',
        }),
        new transports.DailyRotateFile({
          level: 'debug',
          filename: pathFilename('debug', appName),
          datePattern: 'YYYY-MM-DD',
          zippedArchive: true,
          maxSize: '20m',
          maxFiles: '10d',
        }),
      ],
    });
  }

  setup(global: any) {
    this.loggerGlobal = global;
  }

  start(message: any, ...optionalParams: any[]) {
    this.logger.log(this.setupParams('START', message), ...optionalParams);
  }

  log(message: any, ...optionalParams: any[]) {
    this.loggerGlobal = global.loggerGlobal;

    this.logger.log(this.setupParams('LOG', message), ...optionalParams);
  }

  end(message: any, ...optionalParams: any[]) {
    this.logger.log(this.setupParams('END', message), ...optionalParams);
  }

  error(message: any, ...optionalParams: any[]) {
    this.loggerGlobal = global.loggerGlobal;

    this.logger.error(this.setupParams('ERROR', message), ...optionalParams);
  }

  warn(message: any, ...optionalParams: any[]) {
    this.loggerGlobal = global.loggerGlobal;

    this.logger.warn(this.setupParams('WARNING', message), ...optionalParams);
  }

  debug(message: any, ...optionalParams: any[]) {
    this.loggerGlobal = global.loggerGlobal;

    this.logger.debug(this.setupParams('DEBUG', message), ...optionalParams);
  }

  verbose(message: any, ...optionalParams: any[]) {
    this.loggerGlobal = global.loggerGlobal;

    this.logger.verbose(
      this.setupParams('VERBOSE', message),
      ...optionalParams,
    );
  }

  private setupParams(action: string, message: any) {
    return {
      sessionId: this.loggerGlobal?.sessionId,
      ip: this.loggerGlobal?.ip,
      method: this.loggerGlobal?.method,
      url: this.loggerGlobal?.url,
      action: action,
      timestamp: DateTz.getDateNow('YYYY-MM-DD HH:mm:ss'),
      message,
    };
  }
}
