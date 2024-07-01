import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('AppSetup');

  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();

  await app.listen(4000, async () => logger.log(`Server running on 4000`));
}
bootstrap();
