function divEscapedContentElement(message) {
    return $('<div></div>').text(message);
}

function divSystemContentElement(message) {
    return $('<div></div>').html('<i>' + message + '</i>');
}


function processUserInput(chatApp, socket) {
    var message = $('#send-message').val();
    var systemMesssge;
    if (message.charAt(0) == '/') {
        systemMesssge = chatApp.processCommand(message);
        if(systemMesssge) {
            $('messages').append(divSystemContentElement(systemMesssge))
        }
    } else {
        var room = $('#room').val();
        chatApp.sendMessage(room, message);
        $('messages').append(divEscapedContentElement(message));
        $('messages').scrollTop($('messages').prop('scrollHeight'));
    }

    $('#send-message').val('');
}

