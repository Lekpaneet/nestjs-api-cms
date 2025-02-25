import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { VersioningType } from '@nestjs/common';
import { LoggerFactory } from './logger/logger.factory';
import { LoggingInterceptor } from './logger/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new LoggerFactory(),
  });

  //-- set global prefix
  app.setGlobalPrefix('api');

  //-- set render loggers
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerFactory()));

  //-- setup versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
