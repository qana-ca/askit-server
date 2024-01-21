import { Controller, Get } from '@nestjs/common';
import { LobbyManager } from './lobby-manager.service';
import { GetLobbiesResponse } from './lobby-manager.types';

@Controller('lobby-manager')
export class LobbyManagerController {
    constructor(private readonly lobbyManager: LobbyManager) {}

    @Get()
    getLobbies(): GetLobbiesResponse {
        const lobbies = this.lobbyManager.lobbies;
        const parsedLobbies: GetLobbiesResponse = [];

        lobbies.forEach((lobby) => {
            parsedLobbies.push({
                id: lobby.id,
                name: lobby.name,
                connectionCode: lobby.connectionCode,
                mode: lobby.mode,
                playersCount: lobby.clients.size,
                createdAt: lobby.createdAt
            });
        });

        return parsedLobbies;
    }
}
