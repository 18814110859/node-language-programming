/**
 * 实现自己的发布/预订逻辑。
 * 聊天服务器的频道被做成了事件发射器，能对客户端发出的join事件做出响应。
 * 当有客户端加入聊天频道时，join监听器逻辑会将一个针对该客户端的监听器附加到频道上，用来处理会将所有广播消息写入该客户端socket的broadcast事件。
 * 事件类型的名称，比如join和broadcast，完全是随意取的。你也可以按自己的喜好给它们换个名字。
 */

var events = require('events');
var net = require('net');
const { on } = require('process');

var channel = new events.EventEmitter();
// 定义一个发布的客户端
channel.clients = {};
// 定义一个订阅
channel.subscriptions = {};

// 监听一个 join 的事件发射器 来 处理重复的逻辑
channel.on('join', function (id, client) {

    // 如果你想让连接上来的用户看到当前有几个已连接的聊天用户，可以用下面这个监听器方法，它能根据给定的事件类型返回一个监听器数组：
    var welcome = "Welcome!\n" + 'Gueste online: ' + this.listeners('broadcast').length;
    client.write(welcome + '\n');

    // 客户端集合
    this.clients[id] = client;
    // 订阅集合
    this.subscriptions[id] = function (senderId, message) {
        if (id != senderId) {
            this.clients[id].write(message);
        }
    }
    this.on('broadcast', this.subscriptionsp['id']);

});

/**
 * 为了增加能够附加到事件发射器上的监听器数量，
 * 不让Node在监听器数量超过10个时向你发出警告，
 * 可以用setMaxListeners方法。
 */
channel.setMaxListeners(100);

/**
 * 如果你打开几个命令行窗口，在其中任何一个窗口中输入的内容都将会被发送到其他所有窗口中。
 * 这个聊天服务器还有个问题，在用户关闭连接离开聊天室后，原来那个监听器还在，仍会尝
 * 试向已经断开的连接写数据。这样自然就会出错。为了解决这个问题，你还要按照下面的代码清
 * 单把监听器添加到频道事件发射器上，并且向服务器的close事件监听器中添加发射频道的
 * leave事件的处理逻辑。leave事件本质上就是要移除原来给客户端添加的broadcast监听器。
 */
channel.on('leave', function (id) {
    channel.removeListener('broadcast', this.subscriptions[id]);
    channel.emit('broadcast', id, id + "has left the chat .\n");    
});

/**
 * 如果出于某种原因你想停止提供聊天服务，但又不想关掉服务器，可以用removeAllListeners事件发射器方法去掉给定类型的全部监听器。
 */
channel.on('shutDown', function () {
    channel.emit('broadcast', '', "Chat has shut down.\n");
    channel.removeAllListeners('broadcast');
});

// 创建一个服务端
var server = net.createServer(function (client) {
    // 生成id
    var id = client.remoteAddress + ':' + client.remotePort;
    
    // 连接事件
    client.on('connect', function () {
        channel.emit('join', id, client);
    });

    client.on('data', function (data) {
        data = data.toString();
        // 停止服务的事件
        if (data == "shutDown\n\r") {
            channel.emit('shutDown');
        }
        channel.emit('broadcast', id, data);
    });

    // 关闭事件
    client.on('close', function () {
        channel.emit('leave', id);        
    });
});

server.listen(8888);





