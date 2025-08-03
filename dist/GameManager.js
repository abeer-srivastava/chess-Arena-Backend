import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./message.js";
import { Game } from "./Game.js";
export class GameManager {
    games;
    pendingUser;
    users;
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandlers(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter(user => user !== socket);
    }
    addHandlers(socket) {
        socket.on("message", (data) => {
            const parsedMsg = JSON.parse(data.toString());
            if (parsedMsg.type == INIT_GAME) {
                if (this.pendingUser) {
                    // start a game
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                }
                else {
                    this.pendingUser = socket;
                }
            }
            if (parsedMsg.type == MOVE) {
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if (game) {
                    game.makeMove(socket, parsedMsg.move);
                }
            }
        });
    }
}
//# sourceMappingURL=GameManager.js.map