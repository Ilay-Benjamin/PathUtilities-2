import {fullPath} from './assets/scripts/appX';
import { pathHelper } from './inc/bootstrap';
import { manageRouter } from './utilities/routeUtilities';

import express from 'express';
import http from 'http';
import { Server, Socket } from "socket.io";

const app = express();
const server = http.createServer(app);
// Set Cors Headers
// Set Cors Headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const io = new Server(server, {
    cors: {
        origin: "*",  // Allow your client's origin
        methods: ["GET", "POST"]          // Allowed request methods
    }
    //adg
});



manageRouter(app);



io.on('connection', (socket: Socket) => {
    console.log('A user connected');

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('chat message', (msg: string) => {
        console.log('Message: ' + msg);
        io.emit('chat message', msg);  // Broadcasting message to all connected clients
    });
});

server.listen(3000, () => {
    console.log('Listening on *:3000');
    console.log(pathHelper.getEntity('src', pathHelper.SrcEntitiesNames.appXScript).getFullPath());
});


export function sayHello(): void {
    console.log("Hello from sayHello");
}

//console.log("\n\n\nfullPath: ", fullPath + "\n\n\n");

// Export the precomputed fullPath value
export const myFullPath = fullPath;
