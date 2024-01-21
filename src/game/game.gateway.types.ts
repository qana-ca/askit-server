import { IsString } from 'class-validator';
import { Socket } from 'socket.io';
import { Lobby } from 'src/lobby/lobby';
import { ServerEvents } from './game-events.types';

/**
 * The main object that represents a client.
 * It extends the Socket (socket.io) object with the data (our game data) property.
 *
 * @property data - the game data of the client.
 * @property emit - the emit method of the socket.io object, event should be one of the ServerEvents.
 */
export type Client = Socket & {
    data: {
        lobby: null | Lobby;
    };

    emit: <T>(event: ServerEvents, data: T) => boolean;
};

/*  */
/* <---------------------- DTO's ----------------------> */
/*  */

export class JoinLobbyDto {
    @IsString()
    id: string;
}
