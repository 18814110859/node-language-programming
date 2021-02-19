// 本节会介绍两个流行的NoSQL数据库：Redis 和 MongoDB。我们还会看一下Mongoose，一个很受欢迎的MongoDB访问层API，它有一些可以帮你节省时间的功能。
// Redis和MongoDB的设置和管理超出了本书的范围，不过你可以在网上找到Redis（http://redis.io/topics/quickstart）和MongoDB （http://docs.mongodb.org/manual/installation/#installation-guides）的快速教程，你应该能按照这些教程把它们装好跑起来。


// Redis非常适合处理那些不需要长期访问的简单数据存储，比如短信和游戏中的数据。
// Redis把数据存在RAM中，并在磁盘中记录数据的变化。这样做的缺点是它的存储空间有限，但好处是数据操作非常快。
// 如果Redis服务器崩溃，RAM中的内容丢了，可以用磁盘中的日志恢复数据。Redis提供了实用的原语命令集（http://redis.io/commands），可以处理几种数据结构。
// Redis支持的大多数数据结构对开发人员来说并不陌生，因为它们都是仿照编程中常用的数据结构做的：哈希表、链表、键/值对（作为简单的变量使用）。
// 哈希表和键/值对类型如图5-6所示。Redis还支持一种稍微有点儿陌生的数据结构，集合（set），我们在本章后续内容中再讨论它。


// 最成熟、最活跃的Redis API模块是Matt Ranney的node_redis（https://github.com/mranney/node_redis）。用下面这条npm命令安装它：

// 1. 连接Redis服务器
// 下面的代码会连接到运行在同一主机，默认TCP/IP端口上的Redis服务器。你创建的这个Redis客户端继承了EventEmitter的行为，当客户端跟Redis服务器通信出现问题时，它会抛出一个error事件。
// 如下例所示，你可以添加error事件类型的监听器，定义自己的错误处理逻辑：
var redis = require('redis');
var client = redis.createClient(6379, '127.0.0.1');

client.on('error', function (err) {
    console.log(err);
});

// 2. 操作Redis中的数据
// 连上Redis之后，程序可以马上用client对象操作数据。下面例子中是存储和获取键/值对的代码：
client.set('color', 'red', redis.print);

client.get('color', function (err, value) {
    if(err) throw err;
    console.log(value);
});

// 3. 用哈希表存储和获取数据
// 代码清单5-18展示了如何用一个稍微复杂点儿的数据结构，哈希表，也被称为哈希映射，存储和获取数据。哈希表本质上是存放标识的表，这些标识被称为键，与相应的值关联。
// Redis命令hmset设定哈希表中的元素，用键标识值。hkeys列出哈希表中所有元素的键。

client.hmset('camping', {
    'key1' : 'value1',
    'key2' : 'value2',
    'key3' : 'value3',
    'key4' : 'value4',
}, redis.print);

client.hget('camping', 'key1' ,function (err, value) {
    if(err) throw err;
    console.log('Will be key1 with:' + value);
});

client.hkeys('camping', function (err, keys) {
    if(err) throw err;
    keys.forEach(function (key, i) {
        console.log(key);
    });
});



// 4. 用链表存储和获取数据
// 链表是Redis支持的另一种数据结构。如果内存足够大，Redis链表理论上可以存放40多亿条元素。
// 下面是在链表中存储和获取值的代码。Redis命令lpush向链表中添加值。lrange获取参数start和end范围内的链表元素。
// 下面的例子中，参数end为1，表明到链表中最后一个元素，所以这个lrange会取出链表中的所有元素：
client.lpush('tasks', 'Paint the bikeshed red.', redis.print);
client.lpush('tasks', 'Paint the bikeshed green.', redis.print);

client.lrange('tasks', 0, -1, function (err, items) {
    if(err) throw err;
    items.forEach(function (item, i) {
        console.log(item);
    });
});


// Redis链表是有序的字符串链表。如果你要创建一个会议规划程序，可以用链表存储会议的行程。
// 从概念上讲，Redis链表类似于很多编程语言中的数组，并且它们用的也是我们熟知的数据操作办法。
// 然而链表的缺点在于从中获取数据的性能。随着链表长度的增长，数据获取也会逐渐变慢（大O表示法中的O(n)） 。 
// 大O表示法 在计算机科学中，大O表示法是一种按复杂度对算法分类的方法。
// 当你看到用大O表示法描述的算法时，能快速了解该算法的性能。如果你不了解大O，RobBell的“大O表示法初学者指南”能帮你了解其大概含义（http://mng.bz/UJu7）。


// 5. 用集合存储和获取数据
// Redis集合是一组无序的字符串组。如果你要创建一个会议规划程序，可以用集合存储参会者的信息。
// 集合获取数据的性能比链表好。它获取集合成员所用的时间取决于集合的大小（大O表示法中的O(1)）。
// 集合中的元素必须是唯一的，如果你试图把两个相同的值存到集合中，第二次尝试会被忽略。
// 下面是在集合中存储和获取IP地址的代码。Redis命令sadd尝试将值添加到集合中，smembers返回存储在集合中的值。
// 在这个例子中，IP地址204.10.37.96被添加了两次，但如你所见，在显示集合成员时，这个地址只会出现一次：
client.sadd('ip_addresses', '204.10.37.96'. redis.print);
client.sadd('ip_addresses', '72.32.231.8'. redis.print);

client.smembers('ip_addresses', function (err, members) {
    if(err) throw err;
    console.log(members);
});


