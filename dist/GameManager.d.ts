import { WebSocket } from "ws";
export declare class GameManager {
    private games;
    private pendingUser;
    private users;
    constructor();
    addUser(socket: WebSocket): void;
    removeUser(socket: WebSocket): void;
    private addHandlers;
}
//# sourceMappingURL=GameManager.d.ts.map