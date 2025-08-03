import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { INIT_GAME, GAME_OVER, MOVE } from "./message.js";
export class Game {
    player1;
    player2;
    board;
    startTime;
    moveCnt = 0;
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        // Send initial game state to both players
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white",
                board: this.board.board(), // Send initial board state
                fen: this.board.fen(),
                turn: this.board.turn()
            }
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black",
                board: this.board.board(), // Send initial board state
                fen: this.board.fen(),
                turn: this.board.turn()
            }
        }));
    }
    makeMove(socket, move) {
        // Validate turn order
        if (this.moveCnt % 2 === 0 && socket !== this.player1) {
            console.log("Not player1's turn");
            socket.send(JSON.stringify({
                type: "error",
                payload: {
                    message: "Not your turn"
                }
            }));
            return;
        }
        if (this.moveCnt % 2 === 1 && socket !== this.player2) {
            console.log("Not player2's turn");
            socket.send(JSON.stringify({
                type: "error",
                payload: {
                    message: "Not your turn"
                }
            }));
            return;
        }
        // Attempt to make the move
        try {
            const moveResult = this.board.move(move);
            if (!moveResult) {
                console.log("Invalid move:", move);
                socket.send(JSON.stringify({
                    type: "error",
                    payload: {
                        message: "Invalid move"
                    }
                }));
                return;
            }
            console.log("Move made:", moveResult);
        }
        catch (e) {
            console.error("Invalid move execution", e);
            socket.send(JSON.stringify({
                type: "error",
                payload: {
                    message: "Invalid move"
                }
            }));
            return;
        }
        // Increment move counter after successful move
        this.moveCnt++;
        // Check for game over
        if (this.board.isGameOver()) {
            let winner = null;
            let reason = "";
            if (this.board.isCheckmate()) {
                // The player whose turn it is now has been checkmated
                winner = this.board.turn() === "w" ? "black" : "white";
                reason = "checkmate";
            }
            else if (this.board.isDraw()) {
                winner = "draw";
                if (this.board.isStalemate())
                    reason = "stalemate";
                else if (this.board.isInsufficientMaterial())
                    reason = "insufficient material";
                else if (this.board.isThreefoldRepetition())
                    reason = "threefold repetition";
                else
                    reason = "50-move rule";
            }
            const gameOverPayload = {
                type: GAME_OVER,
                payload: {
                    winner,
                    reason,
                    board: this.board.board(),
                    fen: this.board.fen()
                }
            };
            this.player1.send(JSON.stringify(gameOverPayload));
            this.player2.send(JSON.stringify(gameOverPayload));
            return;
        }
        // Send move to the other player
        const movePayload = {
            type: MOVE,
            payload: {
                move: move,
                board: this.board.board(), // Send updated board state
                fen: this.board.fen(),
                turn: this.board.turn(),
                moveCount: this.moveCnt,
                isCheck: this.board.isCheck()
            }
        };
        // Send to the opponent
        if (socket === this.player1) {
            this.player2.send(JSON.stringify(movePayload));
        }
        else {
            this.player1.send(JSON.stringify(movePayload));
        }
        // Also confirm the move to the player who made it
        socket.send(JSON.stringify({
            type: "move_confirmed",
            payload: {
                move: move,
                board: this.board.board(),
                fen: this.board.fen(),
                turn: this.board.turn(),
                moveCount: this.moveCnt,
                isCheck: this.board.isCheck()
            }
        }));
    }
    // Helper method to get current game state
    getGameState() {
        return {
            board: this.board.board(),
            fen: this.board.fen(),
            turn: this.board.turn(),
            moveCount: this.moveCnt,
            isCheck: this.board.isCheck(),
            isGameOver: this.board.isGameOver(),
            winner: this.board.isGameOver() ?
                (this.board.isCheckmate() ?
                    (this.board.turn() === "w" ? "black" : "white") :
                    "draw") : null
        };
    }
}
//# sourceMappingURL=Game.js.map