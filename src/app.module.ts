import { Logger, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { GameGateway } from './game/game.gateway';
import { LobbyManager } from './lobby-manager/lobby-manager';
import { LobbyManagerController } from './lobby-manager/lobby-manager.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { ConfigModule } from '@nestjs/config';
import { config } from './lib/config';
import { LoggerMiddleware } from './middlewares/logger.middleware';

@Module({
    imports: [
        ConfigModule.forRoot({
            load: [config.load],
            isGlobal: true,
            envFilePath: `.env.${process.env.NODE_ENV}`,
            validationSchema: config.validationSchema
        }),
        ScheduleModule.forRoot()
    ],
    controllers: [LobbyManagerController],
    providers: [Logger, GameGateway, LobbyManager]
})
export class AppModule implements NestModule {
    configure(consumer: MiddlewareConsumer) {
        consumer.apply(LoggerMiddleware).forRoutes({ path: '*', method: RequestMethod.ALL });
    }
}
