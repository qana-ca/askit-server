import { Cron } from '@nestjs/schedule';
import { Server } from 'socket.io';
import { ServerEvents } from 'src/game/game-events.types';
import { Client } from 'src/game/game.gateway.types';
import { Lobby } from 'src/lobby/lobby';
import { CreateLobbyDto, Lobbies } from 'src/lobby/lobby.types';

/**
 * LobbyManager is a service that manages lobbies.
 * It is responsible for creating, destroying and managing lobbies.
 * It is also responsible for connecting and disconnecting clients to/from lobbies.
 */
export class LobbyManager {
    public server: Server;
    public readonly lobbies: Lobbies = new Map<Lobby['id'], Lobby>();

    public createLobby(lobbyData: CreateLobbyDto): Lobby {
        const lobby = new Lobby(this.server, lobbyData);

        this.lobbies.set(lobby.id, lobby);

        return lobby;
    }

    public connectClientToLobby(client: Client, lobbyId: string): Lobby {
        const lobby: Lobby = this.lobbies[lobbyId];

        if (lobby) {
            lobby.addClient(client);

            return lobby;
        } else {
            throw new Error('Lobby not found');
        }
    }

    public disconnectClientFromLobby(client: Client, lobbyId: string): void {
        const lobby: Lobby = this.lobbies[lobbyId];

        if (lobby) {
            lobby.removeClient(client);
        } else {
            throw new Error('Lobby not found');
        }
    }

    public destroyLobby(lobbyId: string): void {
        const lobby: Lobby = this.lobbies[lobbyId];

        if (lobby) {
            lobby.clients.forEach((client) => {
                this.disconnectClientFromLobby(client, lobbyId);
            });

            this.lobbies.delete(lobbyId);
        } else {
            throw new Error('Lobby not found');
        }
    }

    @Cron('*/5 * * * *')
    private lobbiesCleaner(): void {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        for (const [_, lobby] of this.lobbies) {
            const now = new Date().getTime();
            const lobbyCreatedAt = lobby.createdAt.getTime();
            const lobbyLifetime = now - lobbyCreatedAt;

            if (lobbyLifetime > Number(process.env.LOBBY_MAX_LIFETIME)) {
                lobby.sendNotificationToLobby({
                    status: 'info',
                    message: 'Lobby is timed out. Destroying...'
                });

                lobby.sendEventToLobby(ServerEvents.GameLifetimeIsOut);

                this.destroyLobby(lobby.id);
            }
        }
    }
}
