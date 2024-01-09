import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WsResponse
} from '@nestjs/websockets';
import {
    AuthenticatedSocket,
    ClientEvents,
    CreateLobbyDto,
    JoinLobbyDto,
    ServerEvents,
    ServerPayloads
} from './game.types';
import { Server, Socket } from 'socket.io';
import { LobbyManager } from 'src/lobby-manager/lobby-manager';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly lobbyManager: LobbyManager, private readonly logger: Logger) {}

    afterInit(server: Server): any {
        this.lobbyManager.server = server;
    }

    async handleConnection(client: Socket): Promise<void> {
        this.lobbyManager.initializeSocket(client as AuthenticatedSocket);
        this.logger.log(`Client connected: ${client.id}`);
    }

    async handleDisconnect(client: AuthenticatedSocket): Promise<void> {
        this.lobbyManager.terminateSocket(client);
    }

    @SubscribeMessage(ClientEvents.CreateLobby)
    onLobbyCreate(
        client: AuthenticatedSocket,
        data: CreateLobbyDto
    ): WsResponse<ServerPayloads[ServerEvents.GameMessage]> {
        const lobby = this.lobbyManager.createLobby(data);
        console.log('Created lobby', lobby);
        lobby.addClient(client);

        return {
            event: ServerEvents.GameMessage,
            data: {
                status: 'success',
                message: 'Lobby created, feel free to invite your friends!'
            }
        };
    }

    @SubscribeMessage(ClientEvents.JoinLobby)
    onJoinLobby(client: AuthenticatedSocket, data: JoinLobbyDto): WsResponse<ServerPayloads[ServerEvents.GameMessage]> {
        const lobbyId = data.id;
        this.lobbyManager.joinLobby(client, lobbyId);

        return {
            event: ServerEvents.GameMessage,
            data: {
                status: 'info',
                message: 'Welcome!'
            }
        };
    }

    @SubscribeMessage(ClientEvents.LeaveLobby)
    onLeaveLobby(client: AuthenticatedSocket): void {
        this.lobbyManager.leaveLobby(client);
    }
}
