import { randomUUID } from 'crypto';
import { Server, Socket } from 'socket.io';
import { AuthenticatedSocket, CreateLobbyDto, GameMode, ServerEvents } from 'src/game/game/game.types';
import { Instance } from 'src/instance/instance';

export class Lobby {
        public readonly id: string = this.generateLobbyId();

        public readonly createdAt: Date = new Date();

        public readonly clients: Map<Socket['id'], AuthenticatedSocket> = new Map<Socket['id'], AuthenticatedSocket>();

        public readonly instance: Instance = new Instance(this);

        public readonly mode: GameMode;

        public readonly name: string;

        public readonly connectionCode: string;

        constructor(private readonly server: Server, lobbyData: CreateLobbyDto) {
                this.mode = lobbyData.mode;
                this.name = lobbyData.name;
                this.connectionCode = lobbyData.connectionCode;
        }

        private generateLobbyId(): string {
                return randomUUID();
        }

        public addClient(client: AuthenticatedSocket): void {
                this.clients.set(client.id, client);
                client.join(this.id);
                client.data.lobby = this;

                // TODO: other logic

                this.dispatchLobbyState();
        }

        public removeClient(client: AuthenticatedSocket): void {
                this.clients.delete(client.id);
                client.leave(this.id);
                client.data.lobby = null;

                // TODO: other logic

                this.dispatchLobbyState();
        }

        public dispatchLobbyState(): void {
                console.log(this.clients);
                // this.server.to(this.id).emit(ServerEvents.GameMessage, this.clients.toString());
        }

        public dispatchToLobby<T>(event: ServerEvents, payload: T): void {
                this.server.to(this.id).emit(event, payload);
        }
}
