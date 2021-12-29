import { Req, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieSession({
    keys: ['alv']
  }))

  app.useGlobalPipes(new ValidationPipe({
    // Ensure the server does not accept any required field in the requests
    whitelist: true,
  }))

  await app.listen(3000);
}
bootstrap();
