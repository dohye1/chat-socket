import express from 'express';
import http from 'http';
import socket from 'socket.io';
import { permittedCrossDomainPolicies } from 'helmet';

const PORT = 5000;
const app = express();
const server = http.createServer(app);
const io = socket(server);

io.on('connection', (socket) => {
    console.log('Somebody in here.....');

    socket.on('init', (data) => {
        console.log(data.name);
        socket.emit('welcome', { socketId: socket.id });
        socket.broadcast.emit('enter', data.name);
    });

    socket.on('sendChat', (data) => {
        io.sockets.emit('receiveMsg', { data, socketId: socket.id });
    })

})

server.listen(5000, () => { console.log(`Listening on PORT : ${PORT}`) });