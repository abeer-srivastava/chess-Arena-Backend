import {WebSocketServer} from "ws";
import { GameManager } from "./GameManager.js";

const wss=new WebSocketServer({port:8080});
const gameManager=new GameManager();

wss.on("connection",(socket)=>{
    gameManager.addUser(socket);
    socket.on("disconnected",()=>gameManager.removeUser(socket));


});