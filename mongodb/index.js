// MongoDB是一个通用的非关系型数据库，使用RDBMS的那类程序都可以使用MongoDB。
// MongoDB数据库把文档存在集合（collection）中。集合中的文档，如图5-8所示，它们不需要相同的schema，每个文档都可以有不同的schema。 
// 这使得MongoDB比传统的RDBMS更灵活，因为你不用为预先定义schema而操心。


// 1. 连接MongoDB 
// 装好node-mongodb-native，运行你的MongoDB服务器，用下面的代码建立服务器连接：

var mongodb = require('mongodb');

var server = new mongodb.Server('127.0.0.1', 27017, {});
var client = new mongodb.Db('mydatabase', server, {w: 1});

// 2. 访问MongoDB集合
// 下面的代码片段展示了如何在数据库连接打开后访问其中的集合。如果在数据库操作完成后你想关闭MongoDB连接，可以执行client.close()： 

client.open(function (err) {
    if(err) throw err;
    client.collection('test_insert', function (err, collection) {
        if(err) throw err;
        // 查询代码...
        
        // 3. 将文档插入集合中
        // 下面的代码将一个文档插入到集合中，并输出其独有的文档ID：
        collection.insert({
            "title" : "",
            "body" : "It is quite good",
        },
        {safe: true},// 安全模式表明数据库操作应该在回调执行之前完成
        function (err, documents) {
            if(err) throw err;
            console.log('Document ID is: ' + documents[0]._id);
        });


    });


    
});


