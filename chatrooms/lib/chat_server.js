var socketio = require('socket.io');
var io;
var guestNumber = 1;
var nickNames = {};
var namesUsed = [];
var currentRoom = {};


exports.listen = function (server) {
    io = socketio.listen(server);
    io.set('log level', 1);

    io.sockets.on('connect', function (socket) {
    
        socket.on('rooms', function () {
            socket.emit('rooms', io.sockets.manager.rooms);
        })
    });


    // 主要的功能：
    // 分配昵称
    // 房间更换
    // 昵称更换
    // 发送消息
    // 房间创建
    // 用户断开

}