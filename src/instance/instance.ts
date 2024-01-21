import { Client } from 'src/game/game.gateway.types';
import { Lobby } from 'src/lobby/lobby';

export class Instance {
    private lobby: Lobby;

    constructor(lobby: Lobby) {
        this.lobby = lobby;
    }

    public showTask(client: Client): void {
        console.log(client);
        this.lobby.dispatchLobbyState();
    }
}
