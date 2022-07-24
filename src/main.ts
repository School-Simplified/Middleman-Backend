import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from 'dotenv';
import helmet from 'helmet';
import { Logger, ValidationPipe } from '@nestjs/common';

config();
async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'debug', 'warn', 'verbose', 'log'],
  });
  app.useGlobalPipes(new ValidationPipe());
  const cfg = new DocumentBuilder()
    .setTitle('Volunteer API')
    .setDescription('Manage SS staff users and accounts')
    .setVersion('1.0')
    .addTag('volunteers')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, cfg);
  SwaggerModule.setup('api', app, document);
  app.use(helmet());
  app.enableCors();
  await app.listen(8000);
  new Logger('APP').log(`Application is running on ${await app.getUrl()}`);
}
bootstrap();
