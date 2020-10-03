const http = require('http');
const express = require('express');
const socketio = require('socket.io');
require('dotenv').config();

const createProject = require('./project/projects.js');

const app = express();
const server = http.createServer(app);
const sockets = socketio(server);
const project = createProject();

sockets.on('connection', (socket) => {
    project.startProject(socket);
})

server.listen(process.env.PORT, ()=> {
    console.log(`Server Listening on port: ${process.env.PORT}`)
})