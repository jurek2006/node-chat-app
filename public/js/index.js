const socket = io();

socket.on('connect', function (){
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

// nasłuchiwanie eventu newMessage z serwera
socket.on('newMessage', function (message){
    console.log('New message', message);
});