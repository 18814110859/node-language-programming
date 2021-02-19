
// 6. 用信道传递数据
// Redis超越了数据存储的传统职责，它提供的信道是无价之宝。信道是数据传递机制，提供了发布/预定功能，其概念如图5-7所示。对于聊天和游戏程序来说，它们很实用。
// Redis客户端可以向任一给定的信道预订或发布消息。预订一个信道意味着你会收到所有发送给它的消息。发布给信道的消息会发送给所有预订了那个信道的客户端。

var net = require('net');
var redis = require('redis');

var server = net.createServer(function (socket) {
    var subscriber;
    var publisher;

    // 为每一个连接到聊天室的用户设置连接的逻辑
    socket.on('connect', function () {
        // 为订阅的用户创建客户端
        subscriber = redis.createClient();
        // 订阅 main_chat_room 通道
        subscriber.subscribe('main_chat_room');
        
        // 管道收到消息后把它发送给用户
        subscriber.on('message', function (channel, message) {
            socket.write('channel:' + channel + ':' + message);
        });
        
        publisher = redis.createClient();
    });

    // 当监听data 事件有消息的时候 触发往管道推送消息的操作 
    socket.on('data', function (data) {
        publisher.publish('main_chat_room', dara);
    });
    
    // 用户断开连接 
    socket.on('end', function () {
        // 销毁 main_chat_room管道
        subscriber.unsubscribe('main_chat_room');
        subscriber.end();
        publisher.end();
    });
});


server.listen(3000);




