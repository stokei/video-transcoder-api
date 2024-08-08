import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SERVER_HOST, SERVER_PORT } from '@/environments';
import { AppExceptionFilter } from '@/interceptors';
import { MainModule } from '@/main.module';

export const createApp = async () => {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create<NestExpressApplication>(MainModule, {
    abortOnError: false
  });

  app.enableCors({
    origin: '*'
  });

  app.enableVersioning({
    type: VersioningType.URI
  });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true
    })
  );
  app.useGlobalFilters(new AppExceptionFilter());
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // Você pode optar por finalizar a aplicação ou tomar outras ações apropriadas
  });

  // Capturando eventos uncaughtException
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception thrown:', error);
    // Você pode optar por finalizar a aplicação ou tomar outras ações apropriadas
  });

  const config = new DocumentBuilder()
    .setTitle('Stokei Video Transcoder API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Stokei')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.listen(SERVER_PORT, SERVER_HOST, async () => {
    logger.log(`Server started at ${await app.getUrl()}!`);
  });
  return app;
};
