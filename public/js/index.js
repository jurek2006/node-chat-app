const socket = io();

socket.on('connect', function (){
    console.log('Connected to server');
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

// nasłuchiwanie eventu newMessage z serwera
socket.on('newMessage', function (message){
    const formattedTime = moment(message.createdAt).format('h:mm a');
    const template = jQuery('#message-template').html();
    const html = Mustache.render(template, {
        text: message.text,
        from: message.from,
        createdAt: formattedTime
    });

    jQuery('#messages').append(html);
});

// nasłuchiwanie eventu newLocationMessage
socket.on('newLocationMessage', function (message) {
    const formattedTime = moment(message.createdAt).format('h:mm a');
    const template = jQuery('#location-message-template').html();
    const html = Mustache.render(template, {
        from: message.from,
        createdAt: formattedTime,
        url: message.url
    });

    jQuery('#messages').append(html);
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