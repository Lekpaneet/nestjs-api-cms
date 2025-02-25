import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { RequestMethod, VersioningType } from '@nestjs/common';
import { join } from 'node:path';
import * as hbs from 'hbs';
import * as hbsUtils from 'hbs-utils';
import { LoggerFactory } from './logger/logger.factory';
import { LoggingInterceptor } from './logger/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: new LoggerFactory(),
  });

  //-- set global prefix
  app.setGlobalPrefix('api', {
    exclude: [{ path: 'logger(.*)', method: RequestMethod.ALL }],
  });

  //-- set render loggers
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(join(__dirname, '..', 'src/logger/public'));
  app.setBaseViewsDir(join(__dirname, '..', 'src/logger/views'));
  hbs.registerPartials(join(__dirname, '..', 'src/logger/views/layouts'));
  hbs.registerHelper('getBaseEndPoint', () => {
    return './logger';
  });
  hbsUtils(hbs).registerWatchedPartials(
    join(__dirname, '..', 'src/logger/views/layouts'),
  );
  app.setViewEngine('hbs');

  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerFactory()));

  //-- setup versioning
  app.enableVersioning({
    type: VersioningType.URI,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
