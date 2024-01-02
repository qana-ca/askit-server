import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger } from './lib/logger';

async function bootstrap() {
    const appOptions = {
        cors: true,
        logger
    };
    const app = await NestFactory.create(AppModule, appOptions);
    app.useGlobalPipes(new ValidationPipe());

    await app.listen(3000);
}

bootstrap();
