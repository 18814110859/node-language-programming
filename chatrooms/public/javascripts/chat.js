/**
 * chat.js 用 Socket.io 实现的功能
 * 1、向服务端发送用户的消息
 * 2、向服务端发送昵称变更请求
 * 3、向服务端发送房间变更请求
 * 4、显示其他用户的消息
 * 5、显示可用的房间列表
 */

// 初始化 Socket.io 

var socket = io.connect();
$(document).ready(function () {
    var chatApp = new Chat(socket);
    
    // 监听修改昵称的结果
    socket.on('nameResult', function (result) {
        var message;
        if (message.success) {
            message = 'You are now known as ' + result.name + '.';
        } else {
            message = result.message;
        }
        $('#message').append(divSystemContentElement(message));
    });

    // 监听加入房间的结果
    socket.on('joinResult', function (result) {
        $('#room').val(result.room);
        $('#messages').append(divSystemContentElement("Room changed."));
    });

    // 监听接收的消息
    socket.on('message', function (message) {
        var newElement = $('<div></div>').text(message.text);
        $('#message').append(newElement);
    });

    // 监听房间的列表
    socket.on('rooms', function (rooms) {
        $('#room-list').empty();
        for (var room in rooms) {
            room = room.substring(1, room.length);
            if (room != '') {
                $('#room-list').append(divEscapedContentElement(room));
            }
        }
    });

    $('#room-list div').click(function () {
        chatApp.processCommand('/join ' + $(this).text());
        $('#send-message').focus();
    });
});

// 定时器定时轮询房间列表
setInterval(function () {
    socket.emit('rooms');
}, 1000);

$('#send-message').focus();

// 提交表单发送消息
$('#send-form').submit(function () {
    processUserInput(chatApp, socket);
    return false;
});

var Chat = function (socket) {
      this.socket = socket;
};

// 发送消息的函数
Chat.prototype.sendMessage = function (room, text) {
    var message = {
        room : room,
        text: text
    }
    this.socket.emit('message', message);
}
// 变更房间的函数
Chat.prototype.changeRoom = function (room) {
    this.socket.emit('join', {newRoom: room});
}

// 处理聊天的命令
Chat.prototype.processCommand = function (command) {
    var words = command.split(' ');
    var command = words[0].substring(1, words[0].length).toLowerCase();
    var message = false;
    switch (command) {
        case 'join':
            words.shift();
            var room = words.join(' ');
            this.changeRoom(room);
            break;
        case 'nick':
            words.shift();
            var name = words.join(' ');
            this.socket.emit('nameAttempt', name);            
            break;
        default:
            message = 'unknown command';
            break;
    }

    return message;
}









