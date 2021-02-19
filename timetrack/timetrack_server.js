// 这个程序会用Node内置的http模块实现Web服务器的功能，用一个第三方模块跟MySQL服务器交互。
// 一个名为timetrack的定制模块，它是程序特有的函数，用来在MySQL中存储、修改和获取数据。图5-4是这个程序的概览。
// 为了让Node能跟MySQL交互，我们会用Felix Geisendörfer做的node-mysql 模块（https://github. com/felixge/node-mysql）。先用下面这条命令安装这个很受欢迎的MySQL Node模块：
// 接下来需要创建两个文件存放程序逻辑。这个两个文件分别是：timetrack_server.js，用来启动程序； timetrack.js，包含程序相关功能的模块。


var http = require('http');
var work = require('./lib/timetrack');
var mysql = require('mysql');

var db = mysql.createConnection({
    host: '127.0.0.1',
    user: 'room',
    password: '',
    database: 'timetrack',
});


/**
 * 定义Web程序的行为。用这个程序可以浏览、添加和删除
 * 工作执行记录。此外还可以归档工作记录。被归档的工作记录不再出现在主页面上，但还可以在一个单独的Web页面上浏览。
 */
var server = http.createServer(function (req, res) {
    switch (req.method) {
        case 'POST':
            switch (req.url) {
                case '/':// 新增
                    
                    break;
                case '/archive':// 归档
                    break;
                case '/delete':
                    break;
            }
            break;
        case 'GET':
            switch (req.url) {
                case '/':
                    
                    break;
                case '/archived':
                    
                    break;
            }
            break;
        default:
            break;
    }
});


db.query(
    "CREATE TABLE IF NOT EXISTS `work` ("
    + "`id` int(10) unsigned NOT NULL AUTO_INCREMENT,"
    + "`hours` DECIMAL(5, 2) unsigned NOT NULL DEFAULT '0.00',"
    + "`date` DATE,"
    + "`archived` tinyint(3) NOT NULL DEFAULT '1',"
    + "`description` LONGTEXT,"
    + ") ENGINE = InnoDB AUTO_INCREMENT = 0 DEFAULT CHARSET = utf8mb4 COMMENT ='工作记录表'"
    , function (err) {
    if (err) throw err;
    console.log('server started...');
    server.listen(3000);
});

