import { Logger, ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SERVER_HOST, SERVER_PORT } from '@/environments';
import { MainModule } from '@/main.module';

export const createApp = async () => {
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

  const config = new DocumentBuilder()
    .setTitle('Stokei Video Transcoder API')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Stokei')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  app.listen(SERVER_PORT, SERVER_HOST, async () => {
    Logger.log(`Server started at ${await app.getUrl()}!`);
  });
  return app;
};
