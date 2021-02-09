/**
 * 一个简单的http服务器响应
 * 
 * Node的策略是提供小而强的网络API，不去跟Rails或Django之类的框架竞争，而是作为类似框架构建基础的巨大平台。
 * 因为有这种设计理念，像会话这种高级概念以及HTTP cookies这样的基础组件都没有包括在Node的内核之中。
 * 那些都要由第三方模块提供。
 */

var http = require('http');

var server = http.createServer(function (req, res) {
    body = 'Hello World';
    // 设置响应头 state
    res.setHeader('Content-Length', body.length);
    res.setHeader('content-type', 'text/plain');
    // 设置响应头 end
    res.statusCode(200); //设定http响应的状态码    

    // res.write(body);
    res.end(body);

});

server.listen(3000);

