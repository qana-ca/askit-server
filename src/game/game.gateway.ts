import {
    OnGatewayConnection,
    OnGatewayDisconnect,
    OnGatewayInit,
    SubscribeMessage,
    WebSocketGateway,
    WsResponse
} from '@nestjs/websockets';
import { Client, JoinLobbyDto } from './game.gateway.types';
import { Server, Socket } from 'socket.io';
import { LobbyManager } from 'src/lobby-manager/lobby-manager.service';
import { Logger } from '@nestjs/common';
import { CreateLobbyDto } from 'src/lobby/lobby.types';
import { ClientEvents, ServerEvents, ServerPayload } from './game-events.types';

@WebSocketGateway({ cors: true })
export class GameGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(private readonly lobbyManager: LobbyManager, private readonly logger: Logger) {}

    /**
     * OnGatewayInit is a lifecycle hook that is executed after the gateway has been initialized.
     */
    public afterInit(server: Server): void {
        this.lobbyManager.server = server;
    }

    /**
     * OnGatewayConnection is a lifecycle hook that is executed when a client connects to the gateway.
     *
     * Изначально мы имеем объект который реализует Socket, чтобы привести его к типу Client
     * мы вывываем метод initializeClient, который добавляет к нему необходимые для нас поля.
     */
    public async handleConnection(client: Socket): Promise<void> {
        this.initializeClient(client);
        this.logger.log(`Client connected: ${client.id}`);
    }

    private async initializeClient(client: Socket): Promise<void> {
        client.data.lobby = null;
    }

    /**
     * OnGatewayDisconnect is a lifecycle hook that is executed when a client disconnects from the gateway.
     */
    public async handleDisconnect(client: Client): Promise<void> {
        if (!client.data.lobby) {
            return;
        }

        this.lobbyManager.disconnectClientFromLobby(client, client.data.lobby.id);
    }

    /*  */
    /* <------------------ Events ------------------> */
    /*  */

    @SubscribeMessage(ClientEvents.CreateLobby)
    onCreateLobby(client: Client, data: CreateLobbyDto): WsResponse<ServerPayload<ServerEvents.ResponseLobbyCreated>> {
        const lobby = this.lobbyManager.createLobby(data);
        this.logger.log(`Lobby created: ${lobby.id}`);

        lobby.addClient(client);

        client.emit(ServerEvents.NotificationToClient, {
            status: 'success',
            message: 'Lobby created! Enjoy your time!'
        });

        return {
            event: ServerEvents.ResponseLobbyCreated,
            data: {
                id: lobby.id
            }
        };
    }

    @SubscribeMessage(ClientEvents.JoinLobby)
    onJoinLobby(client: Client, data: JoinLobbyDto): WsResponse<ServerPayload<ServerEvents.ResponseConnectedToLobby>> {
        const lobbyId = data.id;

        const lobby = this.lobbyManager.connectClientToLobby(client, lobbyId);

        client.emit(ServerEvents.NotificationToClient, {
            status: 'success',
            message: 'Connected to lobby!'
        });

        return {
            event: ServerEvents.ResponseConnectedToLobby,
            data: {
                status: 'success',
                lobby
            }
        };
    }

    @SubscribeMessage(ClientEvents.LeaveLobby)
    onLeaveLobby(client: Client): void {
        if (!client.data.lobby) {
            throw new Error('You are not connected to any lobby');
        }

        this.lobbyManager.disconnectClientFromLobby(client, client.data.lobby.id);
    }
}
