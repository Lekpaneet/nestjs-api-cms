import { Controller, Get, Param, Res, UseGuards } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerGuard } from './logger.guard';

@Controller('logger')
export class LoggerController {
  constructor(private loggerService: LoggerService) {}

  @Get()
  @UseGuards(LoggerGuard)
  async getList() {
    return await this.loggerService.getLists();
  }

  @Get('detail/:path')
  @UseGuards(LoggerGuard)
  async logs(@Param('path') path: string) {
    const logs = await this.loggerService.getLogs(path);
    return {
      path,
      logs,
    };
  }
}
