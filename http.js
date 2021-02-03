var http = require('http');
var fs = require('fs');


// 使用回调创建一个简单的http请求服务端 且在回调中处理逻辑
http.createServer(function (req, res) {
    var template = require('./template');
    template.getHtml(res);
}).listen(8000, "127.0.0.1");





server = http.createServer()

server.on("request", function (req, res) {
    // res.writeHead(200, {'Content-Type': 'text/plain'});
    res.writeHead(200, {'Content-Type': 'image/png'});
    fs.createReadStream('./img.png').pipe(res);
    res.end("Hello World/n");
});

server.listen(3000)