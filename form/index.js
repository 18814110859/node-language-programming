// 4.4 从表单中接受用户输入
// Web程序通常会通过表单收集用户的输入。Node不会帮你承担处理工作（比如验证或文件上
// 传），它只能把请求主体数据交给你。尽管这看起来不太方便，但Node一贯的宗旨是提供简单高
// 效的底层API，把其他机会留给了第三方框架。
// 本节要看一看如何完成下面这些任务：
//  处理提交的表单域；
//  用formidable处理上传的文件；
//  实时计算上传进度。

var http = require('http');
var items = [];

var server = http.createServer(function (req, res) {
    if (req.url == '/') {
        switch (req.method) {
            case "GET":
                show(res);
                break;
            case "POST":
                add(req, res);
                break;
            default:
                badRequest(res);                
                break;
        }
    }
});




/**
 * 待办事项列表页面
 * @param {*} res 
 */
function show(res) {
    var html = '<html><head><title>Todo List</title></head><body>';
        html += '<h1></h1>';
        html += '<ul>';
        html += items.map(function (item) {
            return '<li>' + item + '</li>';
        }).join('');
        html += '</ul>';
        html += '<form method="post" action="/">';
        html += '<p><input type="text" name="item" /></p>';
        html += '<p><input type="submit" value="Add Item" /></p>';
        html += '</form></body></html>';
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}

/**
 * 资源不存在
 * @param {*} res 
 */
function notFound(res) {
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Not Found');
}

/**
 * 无效的请求
 * @param {*} res 
 */
function badRequest(res) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Bad Request');
}


var qs = require('querystring');
function add(req, res) {
    var body = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) {body += chunk;});
    req.on('end', function () {
        var obj = qs.parse(body);
        items.push(obj.item);
        show(res);
    });
}

server.listen(3000);

// 为了简单起见，这个例子假定Content-Type是application/x-www-form-urlencoded，这也是HTML表单的默认值。
// 要解析数据，只需把data事件的数据块拼接到一起形成完整的请求主体字符串。因为不用处理二进制数据，所以可以用res.setEncoding()将请求编码类型设为utf8。
// 在请求发出end事件后，所有data事件就完成了，整个请求体也会变成字符串出现在body变量中。


// 在add()函数中解析请求主体时，用到了Node的querystring模块。来看看在REPL中的快速演
// 示，了解下Node服务器中用到的这个querystring.parse()函数是如何解析请求主体的。
// 假设用户通过HTML表单向待办事项列表中提交了文本“take ferrets to the vet”：

// 在添加完事项之后，服务器调用前面实现的那个show()函数把用户又带回了原来那个表单页。
// 这只是这个例子选择的路由，你可以选择显示一条“事项已添加到待办事项列表中”消息的页面，或者回到/页面。
// 试一下吧。添加几个事项，你会看到待办事项出现在一个未经排序的列表中。你还可以实现前面在REST API中实现的删除功能。



