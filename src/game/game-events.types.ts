import { Lobby } from 'src/lobby/lobby';

/**
 * Client events are the events that the client can emit.
 */
export enum ClientEvents {
    CreateLobby = 'client.create_lobby',
    JoinLobby = 'client.join_lobby',
    LeaveLobby = 'client.leave_lobby',
    EditLobby = 'client.edit_lobby'
}

/**
 * Server events are the events that the server can emit.
 * Three types of server events:
 * - Notification: `.notification.`
 * - Game: `.game.`
 * - Response: `.response.`
 *
 * @see readme.md
 */
export enum ServerEvents {
    NotificationToClient = 'server.notification.to_client',
    NotificationToLobby = 'server.notification.to_lobby',
    GameGiveCard = 'server.game.give_card',
    GameLifetimeIsOut = 'server.game.lifetime_is_out',
    GameShowTask = 'server.game.show_task',
    ResponseLobbyCreated = 'server.response.lobby_created',
    ResponseConnectedToLobby = 'server.response.connected_to_lobby',
    ResponseEditLobby = 'server.response.edit_lobby'
}

/*  */
/* <-------------------- Payloads --------------------> */
/*  */

export type ServerStatusPayload = {
    status?: 'success' | 'error' | 'info';
};

export type ServerPayloads = {
    [ServerEvents.ResponseLobbyCreated]: {
        id: string;
    };
    [ServerEvents.ResponseConnectedToLobby]: {
        lobby: Lobby;
    };
    [ServerEvents.NotificationToClient]: {
        message: string;
    };
    [ServerEvents.NotificationToLobby]: {
        message: string;
    };
};

export type ServerPayload<T extends keyof ServerPayloads> = ServerPayloads[T] & ServerStatusPayload;
