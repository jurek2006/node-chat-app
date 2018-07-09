const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage} = require('./utils/message')

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    // emitowanie wiadomości powitalnej do połączonego użytkownika
    socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));

    // emitowanie wiadomości, że (inny) użytkownik się połączył
    socket.broadcast.emit('newMessage', generateMessage('New user joined', 'New user joined'));

    socket.on('createMessage', message => {
        console.log('create message', message);

        // emitowanie newMessage do wszystkich
        io.emit('newMessage', generateMessage(message.from, message.text));
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

if(!module.parent){
    server.listen(port, () => {
        console.log(`Serwer uruchomiony na porcie ${port}`);
        
    });
};
