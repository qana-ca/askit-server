import { randomUUID } from 'crypto';
import { Server, Socket } from 'socket.io';
import { Client } from 'src/game/game.gateway.types';
import { Instance } from 'src/instance/instance';
import { CreateLobbyDto } from './lobby.types';
import { GameMode } from 'src/instance/instance.types';
import { ServerEvents, ServerPayload } from 'src/game/game-events.types';

/**
 * Represents a lobby.
 * Uses a socket.io room implementation to manage clients.
 */
export class Lobby {
    public readonly id: string = randomUUID();
    public readonly connectionCode: string;
    public readonly name: string;
    public readonly mode: GameMode;
    public readonly createdAt: Date = new Date();

    public readonly instance: Instance = new Instance(this);
    public readonly clients: Map<Socket['id'], Client> = new Map<Socket['id'], Client>();

    constructor(public readonly server: Server, lobbyData: CreateLobbyDto) {
        this.mode = lobbyData.mode;
        this.name = lobbyData.name;
        this.connectionCode = this.generateConnectionCode();
    }

    private generateConnectionCode(): string {
        return randomUUID().slice(0, 6).toUpperCase();
    }

    public addClient(client: Client): void {
        this.clients.set(client.id, client);
        client.join(this.id);
        client.data.lobby = this;

        this.dispatchLobbyState();
    }

    public removeClient(client: Client): void {
        this.clients.delete(client.id);
        client.leave(this.id);
        client.data.lobby = null;

        this.dispatchLobbyState();
    }

    public dispatchLobbyState(): void {
        this.server.to(this.id).emit(ServerEvents.NotificationToLobby, this.clients.size);
    }

    public sendEventToLobby<T>(event: ServerEvents, payload?: T): void {
        this.server.to(this.id).emit(event, payload);
    }

    public sendNotificationToLobby(payload: ServerPayload<ServerEvents.NotificationToLobby>): void {
        this.server.to(this.id).emit(ServerEvents.NotificationToLobby, payload);
    }
}
