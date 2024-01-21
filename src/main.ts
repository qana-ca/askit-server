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

    if (process.env.ASKIT_SERVER_PORT == undefined) {
        throw new Error('ASKIT_SERVER_PORT is not defined. Please define it in .env file.');
    } else {
        await app.listen(process.env.ASKIT_SERVER_PORT);
    }
}

bootstrap();
