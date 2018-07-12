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
    const li = jQuery('<li></li>');
    li.text(`${message.from}: ${message.text}`);
    jQuery('#messages').append(li);
});

// nasłuchiwanie eventu newLocationMessage
socket.on('newLocationMessage', function (message) {
    console.log('New location message', message);
    const li = jQuery('<li></li>');
    const a = jQuery('<a target="_blank">Moja aktualna lokalizacja</a>');
    li.text(`${message.from}: `);
    a.attr('href', message.url);

    li.append(a);
    jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    const messageTextBox = jQuery('[name=message]');
    socket.emit('createMessage', {
        from: 'User',
        text: messageTextBox.val()
    }, function (data) {
        // wyczyszczenie pola tekst po prawidłowym wysłaniu wiadomości
        messageTextBox.val('');
    })
});

const locationButton = jQuery('#send-location');
locationButton.on('click', function () {
    // sprawdzenie czy geolokacja obsługiwana - jeśli nie - przerwanie skryptu i wyświetlenie alertu

    
    if(!navigator.geolocation){
        return alert('Geolokacja nieobsługiwana przez Twoją przeglądarkę');
    }

    locationButton.attr('disabled', 'disabled').text('Wysyłanie lokalizacji');

    navigator.geolocation.getCurrentPosition(function (position) {
        locationButton.removeAttr('disabled').text('Wyślij lokalizację');
        socket.emit('createLocationMessage', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        })
    }, function () {
        locationButton.removeAttr('disabled').text('Wyślij lokalizację');
        alert('Niemożliwe pobranie lokalizacji');
    });
});