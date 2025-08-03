import { WebSocket } from "ws"
import { Chess } from "chess.js";
import { INIT_GAME,GAME_OVER, MOVE } from "./message.js";

export class Game{
    public player1:WebSocket;
    public player2:WebSocket;
    public board:Chess;
    private startTime:Date;
    private moveCnt=0


    constructor(player1:WebSocket,player2:WebSocket){
        this.player1=player1;
        this.player2=player2;
        this.board=new Chess();
        this.startTime=new Date();

        this.player1.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"white"
            }
        }))
        this.player2.send(JSON.stringify({
            type:INIT_GAME,
            payload:{
                color:"black"
            }
        }))
    }

    makeMove(socket:WebSocket,move:{
        from:string,
        to:string
    }){

        // if (even move count && socket is not player1) return;
        if(this.moveCnt%2===0 && socket!==this.player1){
            console.log("even move count and socket is not player1");
            return;
        }
        // if (odd move count && socket is not player2) return;
        if(this.moveCnt%2===1 && socket!==this.player2){
          console.log("odd move count and socket is not player2");

            return;
        }

        try{
            this.board.move(move);
         
        }catch(e){
             console.error("Invalid move execution", e);
            return;
        }

        if(this.board.isGameOver()){
            this.player1.send(JSON.stringify({
                type:GAME_OVER,
                payload:{
                    winner:this.board.turn()==="w"?"black":"white",
                }
            }))
            this.player2.send(JSON.stringify({
                 type:GAME_OVER,
                payload:{
                    winner:this.board.turn()==="w"?"black":"white",
                }
            }))
            return;
        }

        // if (even move count(that means the player1 made the move) then send to player2)
        if(this.moveCnt%2===0){
            this.player2.send(JSON.stringify({
                type:MOVE,
                payload:{
                    move:move
                }
            }))
        }
        // if (odd move count(that means the player2 made the move) then send to player1)
        else{
            this.player1.send(JSON.stringify({
                type:MOVE,
                payload:{
                    move:move
                }
            }))
        }
        this.moveCnt++;
    }
}