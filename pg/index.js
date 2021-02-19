// 5.2.2 PostgreSQL 
// PostgreSQL因其与标准的兼容性和健壮性受到认可，很多Node开发人员对它的喜爱程度超过了其他的RDBMS。
// 不像MySQL，PostgreSQL支持递归查询和很多特殊的数据类型。
// PostgreSQL还能使用一些标准的认证方法，比如轻量目录访问协议（LDAP）和通用安全服务应用程序接口（GSSAPI）。
// 对于要借助数据复制实现扩展能力或冗余性的那些人来说，PostgreSQL支持同步复制，这种复制形态会在每次数据操作后对复制进行验证，从而防止数据丢失。
// 如果你刚开始接触PostgreSQL，可以通过它的官方在线教程学习它（https://www.postgresql.org/docs/7.4/static/tutorial.html）。
// 最成熟，并且也是最活跃的PostgreSQL API模块是Brian Carlson的node-postgres（https://github.com/brianc/node-Postgres）。

// 1. 连接POSTGRESQL 
// 装好node-postgres模块后，你就可以用下面的代码连接PostgreSQL，并选择一个数据库进行查询操作（如果没有设定密码，请忽略连接字串中的:mypassword部分）：

var pg = require('pg');
var conString = "tcp://myuser:mypassword@localhost:5432/mydatabase";

var client = new pg.Client(conString);
client.connect();

// 2. 往数据库表里插入一条记录
// query方法执行查询操作。下面的代码展示了如何向数据库表中插入一条记录：
client.query(
    'INSERT INFO users ' + 
    "(name) VALUES ('Mike')"
);

// 占位符（$1、$2等等）可以指明把参数放在哪里。在添加到查询语句中去之前，每个参数都会被转义，以防遭受SQL注入攻击。
// 下面是使用占位符插入一条记录的例子：

client.query(
    'INSERT INFO users ' + 
    "(name, age) VALUES ($1, $2)",
    ['Mike', 29]
);


// 要在插入一条记录后得到它的主键值，可以用RETURNING从句加上列名指定想要返回哪一列的值。
// 然后添加一个回调函数作为query调用的最后一个参数，代码如下所示：
client.query(
    'INSERT INFO users ' + 
    "(name, age) VALUES ($1, $2) " +
    "RETURNING id",
    ['Mike', 29],
    function (err, result) {
        if(err) throw err;
        console.log("Insert id is " + result.rows[0].id);
    }
);



// 3. 创建返回结果的查询
// 如果你准备创建一个将要返回结果的查询操作，就需要把客户端query方法的返回值存放到变量中。
// query方法返回的是一个继承了EventEmitter的行为的对象，可以利用Node内置的功能。
// 这个对象每取回一条数据库记录，就会发出一个row事件。代码清单5-17展示了如何输出查询返回的记录中的数据。
// 注意EventEmitter监听器的用法，它定义了如何处理数据库表中的记录，以及在数据获取完成时做什么。


var query = client.query(
    "SELECT * FROM users WHERE age >= $1",
    [29]
);

// 处理返回的数据
query.on('row', function (row) {
    console.log(row);
});

// 查询完成的事件
query.on('end', function () {
    client.end();
});




