const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const {generateMessage, generateLocationMessage} = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

const publicPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);
const users = new Users();

app.use(express.static(publicPath));

io.on('connection', (socket) => {
    console.log('New user connected');

    socket.on('join', (params, callback) => {
        if(!isRealString(params.name) || !isRealString(params.room)){
            callback('Name and room are required');
        } 
        const room = params.room.toLowerCase();
        socket.join(room);
        users.removeUser(socket.id);
        users.addUser(socket.id, params.name, room);

        io.to(room).emit('updateUsersList', users.getUserList(room));
            
        // emitowanie wiadomości powitalnej do połączonego użytkownika
        socket.emit('newMessage', generateMessage('Admin', 'Welcome to the chat'));

        // emitowanie wiadomości, że (inny) użytkownik się połączył
        socket.broadcast.to(room).emit('newMessage', generateMessage('Admin', `${params.name} joined`));
        callback();
    });

    socket.on('createMessage', (message, callback) => {
        const user = users.getUser(socket.id);

        if(user && isRealString(message.text)){
            io.to(user.room).emit('newMessage', generateMessage(user.name, message.text));
        }

        callback();
    });

    socket.on('disconnect', () => {
        const user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit('updateUsersList', users.getUserList(user.room));
            io.to(user.room).emit('newMessage', generateMessage('Admin', `${user.name} has left`));
        }
    });

    socket.on('createLocationMessage', (coords) => {
        const user = users.getUser(socket.id);

        if(user){
            io.to(user.room).emit('newLocationMessage', generateLocationMessage(user.name, coords.latitude, coords.longitude));
        }
    });
});

if(!module.parent){
    server.listen(port, () => {
        console.log(`Serwer uruchomiony na porcie ${port}`);
        
    });
};
