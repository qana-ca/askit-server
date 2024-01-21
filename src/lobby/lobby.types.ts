import { GameMode } from 'src/instance/instance.types';
import { Lobby } from './lobby';
import { IsNotEmpty, IsString } from 'class-validator';

export type Lobbies = Map<Lobby['id'], Lobby>;

export class CreateLobbyDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsString()
    @IsNotEmpty()
    mode: GameMode;
}
