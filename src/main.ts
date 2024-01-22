import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { logger } from './logger/logger';
import { applicationConfig } from './config/config.module';

async function bootstrap() {
    const appOptions = {
        cors: true,
        logger
    };

    const app = await NestFactory.create(AppModule, appOptions);
    app.useGlobalPipes(new ValidationPipe());
    app.setGlobalPrefix('api');

    if (!applicationConfig.port) {
        throw new Error('Port is not defined');
    }

    await app.listen(applicationConfig.port);
}

bootstrap().catch((err) => {
    logger.error(err);
    process.exit(1);
});
