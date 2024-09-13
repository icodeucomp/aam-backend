import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  const port = config.get<number>('PORT') || 3000;

  app.setGlobalPrefix('/api/v1');
  app.enableCors({ credentials: true });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  await app.listen(port, async () => {
    console.log(`API is running on: ${await app.getUrl()}`);
  });
}
bootstrap();
