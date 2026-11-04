import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = process.env.PORT ?? 3000;
  await app.listen(port);

  Logger.log(`Server running on: http://localhost:${port}`, 'Bootstrap');
  Logger.log(` Apollo Sandbox: http://localhost:${port}/graphql`, 'Bootstrap');
}
await bootstrap();
