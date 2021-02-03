var net = require('net');

/**
 * 事件发射器会触发事件
 * 并且在那些事件被触发时能处理它们
 */
net.createServer(function (socket) {
    socket.on('data', function (data) {
        socket.write(data);
    });
}).listen(8080);


/**
 *  响应只发生一次
 */
net.createServer(function (socket) {
    socket.once('data', function (data) {
        socket.write(data);
    });
});

/**
 * 一个PUB/SUB 的例子
 */
var EventEmitter = require('events');
var channel = new EventEmitter();
channel.emit('join');
channel.on('join', function () {
    console.log('Welcome');
});








