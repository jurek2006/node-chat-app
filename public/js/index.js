const socket = io();

const roomSelect = jQuery('#room-select');
const newRoomName = jQuery('#new-room-input');

socket.emit('getRoomsList', function (roomsList) {
    console.log(roomsList);
    const roomSelect = jQuery('#room-select');
    roomsList.forEach(room => {
        const template = jQuery('#select-room-template').html();
        const html = Mustache.render(template, {
            value: room,
            optionName: room
        });
    
        roomSelect.append(html);
    });

    roomSelect.change(function () {
        if(jQuery(this).val().length !== 0){
            newRoomName.attr('disabled', 'disabled');
            newRoomName.val('');
        } else {
            newRoomName.removeAttr("disabled");                                   
        }
    })
});

