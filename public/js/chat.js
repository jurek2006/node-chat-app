const socket = io();

function scrollToBottom() {
    // selectors
    const messages = jQuery('#messages');
    const newMessage = messages.children('li:last-child')
    // heights
    const clientHeight = messages.prop('clientHeight');
    const scrollTop = messages.prop('scrollTop');
    const scrollHeight = messages.prop('scrollHeight');
    const newMessageHeight = newMessage.innerHeight();
    const lastMessageHeight = newMessage.prev().innerHeight();

    if(clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight){
        messages.scrollTop(scrollHeight);
    } 
}

socket.on('connect', function (){
    const params = jQuery.deparam(window.location.search);

    socket.emit('join', params, function (err) {
        if(err){
            alert(err);
            window.location.href = '/'
        } else {
            console.log('No error');
        }
    });
});

socket.on('disconnect', function () {
    console.log('Disconnected from server');
});

socket.on('updateUsersList', function (users) {
    const ol = jQuery('<ol></ol>');

    users.forEach(function(user){
        ol.append(jQuery('<li></li>').text(user));
    });

    jQuery('#users').html(ol);
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
    scrollToBottom();
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
    scrollToBottom();
});

jQuery('#message-form').on('submit', function (e) {
    e.preventDefault();

    const messageTextBox = jQuery('[name=message]');
    socket.emit('createMessage', {
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