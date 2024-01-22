import { Controller, Get, NotFoundException, Param, Req } from '@nestjs/common';
import { LobbyManager } from './lobby-manager.service';
import { GetLobbiesResponse } from './lobby-manager.types';
import { Lobby } from 'src/lobby/lobby';

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

    @Get('/:lobbyId')
    getLobby(@Param() { lobbyId }): any {
        const lobbies = this.lobbyManager.lobbies;

        console.log(lobbyId);

        const lobby = lobbies.get(lobbyId);

        if (!lobby) {
            throw new NotFoundException('Lobby not found');
        }

        return {
            id: lobby.id,
            name: lobby.name,
            connectionCode: lobby.connectionCode,
            mode: lobby.mode,
            playersCount: lobby.clients.size,
            createdAt: lobby.createdAt
        };
    }
}
