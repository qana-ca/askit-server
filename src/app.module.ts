import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { GameGateway } from './game/game.gateway';
import { LobbyManager } from './lobby-manager/lobby-manager.service';
import { LobbyManagerController } from './lobby-manager/lobby-manager.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerMiddleware } from './logger/logger.middleware';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule, databaseConfig, throttlerConfig } from './config/config.module';

@Module({
    imports: [
        ConfigModule,
        ScheduleModule.forRoot(),
        ThrottlerModule.forRoot([
            {
                ttl: throttlerConfig.ttl,
                limit: throttlerConfig.limit
            }
        ]),
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: databaseConfig.host,
            port: databaseConfig.port,
            username: databaseConfig.username,
            password: databaseConfig.password,
            database: databaseConfig.database,
            autoLoadEntities: true,
            synchronize: true
        }),
        UserModule
    ],
    controllers: [LobbyManagerController],
    providers: [
        Logger,
        {
            provide: APP_GUARD,
            useClass: ThrottlerGuard
        },
        GameGateway,
        LobbyManager
    ]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
