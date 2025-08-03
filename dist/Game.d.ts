import { WebSocket } from "ws";
import { Chess } from "chess.js";
export declare class Game {
    player1: WebSocket;
    player2: WebSocket;
    board: Chess;
    private startTime;
    private moveCnt;
    constructor(player1: WebSocket, player2: WebSocket);
    makeMove(socket: WebSocket, move: {
        from: string;
        to: string;
    }): void;
    getGameState(): {
        board: ({
            square: import("chess.js").Square;
            type: import("chess.js").PieceSymbol;
            color: import("chess.js").Color;
        } | null)[][];
        fen: string;
        turn: import("chess.js").Color;
        moveCount: number;
        isCheck: boolean;
        isGameOver: boolean;
        winner: string | null;
    };
}
//# sourceMappingURL=Game.d.ts.map