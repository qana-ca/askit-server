import { Module } from '@nestjs/common';
import { GameGateway } from './game/game/game.gateway';
import { LobbyManager } from './lobby-manager/lobby-manager';
import { LobbyManagerController } from './lobby-manager/lobby-manager.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
        imports: [ScheduleModule.forRoot()],
        controllers: [LobbyManagerController],
        providers: [GameGateway, LobbyManager],
})
export class AppModule {}
