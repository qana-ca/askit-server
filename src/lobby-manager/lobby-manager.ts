import { Cron } from '@nestjs/schedule';
import { Server } from 'socket.io';
import { AuthenticatedSocket, CreateLobbyDto, ServerEvents, ServerPayloads } from 'src/game/game.types';
import { Lobby } from 'src/lobby/lobby';
import { Lobbies } from 'src/lobby/lobby.types';

const LOBBY_MAX_LIFETIME = Number(process.env.LOBBY_MAX_LIFETIME) || 600;

export class LobbyManager {
    public server: Server;
    public readonly lobbies: Lobbies = new Map<Lobby['id'], Lobby>();

    public initializeSocket(client: AuthenticatedSocket): void {
        client.data.lobby = null;
    }

    public getLobbies(): Lobbies {
        return this.lobbies;
    }

    public terminateSocket(client: AuthenticatedSocket): void {
        client.data.lobby?.removeClient(client);
    }

    public createLobby(lobbyData: CreateLobbyDto): Lobby {
        const lobby = new Lobby(this.server, lobbyData);

        this.lobbies.set(lobby.id, lobby);

        return lobby;
    }

    public joinLobby(client: AuthenticatedSocket, id: string): void {
        const lobby: Lobby = this.lobbies[id];
        if (lobby) {
            lobby.addClient(client);
        } else {
            console.log('Error while join lobby..');
        }
    }

    public leaveLobby(client: AuthenticatedSocket): void {
        const lobby: Lobby = this.lobbies[client.data.lobby.id];
        if (lobby) {
            lobby.removeClient(client);
        } else {
            console.log('Error while leaving lobby');
        }
    }

    @Cron('*/5 * * * *')
    private lobbiesCleaner(): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_lobbyId, lobby] of this.lobbies) {
            const now = new Date().getTime();
            const lobbyCreatedAt = lobby.createdAt.getTime();
            const lobbyLifetime = now - lobbyCreatedAt;

            if (lobbyLifetime > LOBBY_MAX_LIFETIME) {
                lobby.dispatchToLobby<ServerPayloads[ServerEvents.GameMessage]>(ServerEvents.GameMessage, {
                    status: 'info',
                    message: 'Game timed out'
                });

                this.lobbies.delete(lobby.id);
            }
        }
    }
}
