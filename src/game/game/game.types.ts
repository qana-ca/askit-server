import { IsString } from 'class-validator';
import { Socket } from 'socket.io';
import { Lobby } from 'src/lobby/lobby';

export enum ClientEvents {
        CreateLobby = 'client.create_lobby',
        JoinLobby = 'client.join_lobby',
        LeaveLobby = 'client.leave_lobby',
}

export enum ServerEvents {
        GameMessage = 'server.game_message',
}

export type ServerPayloads = {
        [ServerEvents.GameMessage]: {
                message: string;
                status?: 'info' | 'success' | 'error';
        };
};
export type AuthenticatedSocket = Socket & {
        data: {
                lobby: null | Lobby;
        };

        emit: <T>(ev: ServerEvents, data: T) => boolean;
};

export type GameMode = 'quiz' | 'one_word' | 'speaking';

export class CreateLobbyDto {
        @IsString()
        name: string;

        @IsString()
        connectionCode: string;

        @IsString()
        mode: GameMode;
}

export class JoinLobbyDto {
        @IsString()
        id: string;
}
