export enum ClientEvents {
    CreateLobby = 'client.create_lobby',
    JoinLobby = 'client.join_lobby',
    LeaveLobby = 'client.leave_lobby'
}

export enum ServerEvents {
    GameMessage = 'server.game_message'
}

export type ServerPayloads = {
    [ServerEvents.GameMessage]: {
        message: string;
        status?: 'info' | 'success' | 'error';
    };
};
