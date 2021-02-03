var socketio = require('socket.io');
var io;
/**
 * 用户的自增ID
 */
var guestNumber = 1;

/**
 * 用户信息的对象
 * 数据结构 socket.id : userName
 */
var nickNames = {};

/**
 * 用户使用的昵称 数组
 */
var namesUsed = [];


/**
 * 用户存储 房间的 的 socket.id
 * 数据结构：socket.id : room
 */
var currentRoom = {};

/**
 * 主要的功能：
 * 分配昵称
 * 房间更换
 * 昵称更换
 * 发送消息
 * 房间创建
 * 用户断开
 */

module.exports.listen = function (server) {
    io = socketio.listen(server);
    io.set('log level', 1);

    io.sockets.on('connect', function (socket) {
        assignGuestName(socket, guestNumber, nickNames, namesUsed);
        handleMessageBroadcasting(socket, nickNames);
        handleNameChangeAttempts(socket, nickNames, namesUsed);
        handleRoomJoining(socket);
        fetchRooms(socket, io);
        handleClientDisconnect(socket, nickName, namesUsed);
    });
}

/**
 * 获取房间列表
 * @param {*} socket 
 * @param {*} io 
 */
function fetchRooms(socket, io) {
    socket.on('rooms', function () {
        socket.emit('rooms', io.sockets.manager.rooms);
    })
}


/**
 * 分配昵称
 * @param {*} socket 
 * @param {*} guestNumber 
 * @param {Object} nickNames 
 * @param {Array} namesUsed 
 */
function assignGuestName(socket, guestNumber, nickNames, namesUsed) {
    var name = 'Guest:' + guestNumber;
    nickNames[socket.id] = name;
    socket.emit('nameResult', {
        success: true,
        name: name
    });

    namesUsed.push(name);
    guestNumber += 1;// 自增加1
}

/**
 * 加入房间
 * @param {*} socket 
 * @param {string} room 
 */
function joinRoom(socket, room) {
    socket.join(room);
    // 记录当前用户的房间ID
    currentRoom[socket.id] = room;
    socket.emit("joinResult", {room: room});// 给加入的用户发消息

    // 给房间的其他用户发送消息 有新用户加入房间
    socket.broadcast.to(room).emit('message', {
        test: nickNames[socket.id] + 'has joined ' + room + '.'
    });

    // 获取房间里面的用户 socket.id 且汇总这个房间里面有那些用户 且发送消息说房间有那些用户
    var usersInRoom = io.sockets.clients(room);
    console.log(usersInRoom);

    if (usersInRoom.length > 1) {
        var usersInRoomSummary = 'Users currently in ' + room + ': ';
        for(var index in usersInRoom) {
            var userSocketId = usersInRoom[index].id;
            if (userSocketId != socket.id) {
                if (index > 0) {
                    usersInRoomSummary += ',';
                }
                usersInRoomSummary += nickNames[userSocketId];
            }
        }
        usersInRoomSummary += '.';
        socket.emit('message', {text: usersInRoomSummary});
    }
}

/**
 * 更改姓名
 * @param {*} socket 
 * @param {object} nickNames 
 * @param {Array} namesUsed 
 */
function handleNameChangeAttempts(socket, nickNames, namesUsed) {
    socket.on('nameAttempt', function (name) {
        if (name.indexOf('Guest') == 0) {
            socket.emit('nameResult', {
                success: false,
                message: 'Names cannot begin with "Guest".'
            });
        } else {
            if (namesUsed.indexOf(name) == -1) {
                var previousName = nickNames[socket.id]; // 获取以前的昵称
                var previousNameIndex = namesUsed.indexOf(previousName);// 获取以前的昵称的索引
                namesUsed.push(name); // 把新的昵称 push 到 nameUsed
                nickNames[socket.id] = name; 
                delete namesUsed[previousNameIndex]; // 删除以前的昵称
                
                socket.emit('nameResult', {
                    success: true,
                    name: name
                });
                socket.broadcast.to(currentRoom[socket.id]).emit('message', {
                    text: previousName + ' is now known as ' + name + '.'
                });
            } else {
                socket.emit(nameResult, {
                    success: false,
                    message: 'That name is already in use.'
                })
            } 
        }
    });
}



/**
 * 推送消息
 * @param {*} socket 
 */
function handleMessageBroadcasting(socket, nickNames) {
    socket.on('message', function (msg) {
        socket.broadcast.to(msg.room).emit('message', {
            text: nickNames[socket.id] + ':' + msg.text
        })
    })
}

/**
 * 创建房间 且 加入房间
 * @param {*} socket 
 */
function handleRoomJoining(socket) {
    socket.on('join', function (room) {
        socket.leave(currentRoom[socket.id]);
        joinRoom(socket, room);
    })
}

function handleClientDisconnect(socket, nickName, namesUsed) {
    socket.on('disconnect', function () {
        var nameIndex = namesUsed.indexOf(socket.id);
        delete namesUsed[nameIndex];
        delete nickNames[socket.id];
    });
}
