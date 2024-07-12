import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Configuration } from './utils/';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('AppSetup');

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(Configuration.apiPort, async () => {
    logger.log(`Server running on ${Configuration.apiPort}`);
  });
}
bootstrap();
