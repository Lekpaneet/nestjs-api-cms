import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { LoggerService } from './logger.service';

@Controller('logger')
export class LoggerController {
  constructor(private loggerService: LoggerService) {}

  @Get()
  home(@Res() res: Response) {
    return res.render('home', {
      message: 'Hello world!',
    });
  }

  @Get('logs')
  async logs(@Res() res: Response) {
    await this.loggerService.getLogs();
    return res.render('logs', {
      message: 'Hello world!',
    });
  }
}
