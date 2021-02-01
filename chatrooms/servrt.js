var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
var cache = {};
var chatSvrver = require('./lib/chat_server');


// 创建一个http 的服务器
// 用匿名函数对每一个请求进行处理
servrt = http.createServer(function (req, res) {
    var filePath = false;
    
    if (req.url == '/') {
        filePath = 'public/index.html'; // 默认的html 文件
    } else {
        filePath = 'public/' + req.url; // 将url 转化为文件的相对路径 
    }
    var absPath = './' + filePath;
    serverStatic(res, cache, absPath);
});

server.listen(function () {
    console.log("server listening part 3000.");
});


chatSvrver.listen(server);




/**
 * 发送 404 error
 * @param {*} res 
 */
function send404(res) {
    res.writeHead(200, {"Content-Type": "text/plain"});
    res.write("Error 404: resource not found.");
    res.end();
}

/**
 * 发送文件
 * @param {*} res 
 * @param {*} filePath 
 * @param {*} fileContents 
 */
function sendFile(res, filePath, fileContents) {
    res.writeHead(200, {"Content-Type": mime.lookup(path.basename(filePath))});
    res.end(fileContents);
}

/**
 * 静态文件服务
 * @param {*} res 
 * @param {*} cache 
 * @param {*} absPath 
 */
function serverStatic(res, cache, absPath) {
    if (cache[absPath]) {                       // 检查文件是否缓存在内存中
        sendFile(res, absPath, cache[absPath]); // 从内存中返回文件
    } else {
        //检查文件是否存在
        fs.exists(absPath, function (exists) {
            if (exists) {// 如果文件存在 在硬盘中读取文件
                fs.readFile(absPath, function (err, data) {
                    if (err) {
                        send404(res);
                    }else {
                        cache[absPath] = data;
                        sendFile(res, absPath, data);
                    }
                });
            } else {
                send404(res);    
            }
        });
    }
}

