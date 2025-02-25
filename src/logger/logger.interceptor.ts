import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { LoggerFactory } from './logger.factory';
import { Observable, tap } from 'rxjs';
import { Request } from 'express';
import { v4 } from 'uuid';

global.loggerGlobal;

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: LoggerFactory) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const httpContext = context.switchToHttp();
    const req = httpContext.getRequest<Request>();
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const { method, url } = req;
    const sessionId = v4();

    if (new RegExp('logger/').test(url)) {
      return next.handle();
    }

    global.loggerGlobal = {
      sessionId,
      ip,
      url,
      method,
    };

    this.logger.setup(global.loggerGlobal);
    this.logger.start('', LoggingInterceptor.name);

    return next.handle().pipe(
      tap((res) => {
        this.logger.end({ response: res }, LoggingInterceptor.name);
      }),
    );
  }
}
