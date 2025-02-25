import {
  Injectable,
  CanActivate,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class LoggerGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();

    if (
      request.headers['logger_client_id'] !==
      '2c3e2c05-7ab8-46f0-bd99-6f9bd7f9a5c7'
    ) {
      throw new BadRequestException('Invalid client id');
    }

    return true;
  }
}
