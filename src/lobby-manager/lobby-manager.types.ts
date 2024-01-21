import { GameMode } from 'src/instance/instance.types';

export type GetLobbiesResponse = Array<{
    id: string;
    name: string;
    connectionCode: string;
    mode: GameMode;
    playersCount: number;
    createdAt: Date;
}>;
