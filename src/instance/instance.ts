import { AuthenticatedSocket } from 'src/game/game/game.types';
import { Lobby } from 'src/lobby/lobby';

export class Instance {
        private lobby: Lobby;

        constructor(lobby: Lobby) {
                this.lobby = lobby;
        }

        public showTask(client: AuthenticatedSocket): void {
                // game logic
                console.log(client);
                this.lobby.dispatchLobbyState();
        }
}
