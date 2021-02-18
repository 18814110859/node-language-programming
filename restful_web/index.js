/**
 * 4.2 构建 RESTful Web 服务
 * 假设你想用Node创建一个待办事项清单的Web服务，涉及到典型的创建、读取、更新和删除（CRUD）操作。
 * 这些操作的实现方式有很多种，但本节要创建一个RESTful Web服务，一个使用HTTP方法谓词提供精简API的服务。
 * HTTP 1.0和1.1规范的突出贡献者之一，Roy Fielding博士在2000年提出了表征状态转移（REST）
 * ①。依照惯例，HTTP谓词，比如GET、POST、PUT和DELETE，分别跟由URL指定的资源的获取、创建、更新和移除相对应。RESTfl Web服务之所以得以流行，是因为它们的使用和实现比简单对象访问协议（SOAP）之类的协议更简单。
 * 本节会用cURL（http://curl.haxx.se/download.html）代替Web浏览器跟Web服务交互。
 * cURL是一个强大的命令行HTTP客户端，可以用来向目标服务器发送请求。
 * 创建标准的REST服务器需要实现四个HTTP谓词。每个谓词会覆盖一个待办事项清单的操作
 * 任务：
 *  POST 向待办事项清单中添加事项；
 *  GET 显示当前事项列表，或者显示某一事项的详情；
 *  DELETE 从待办事项清单中移除事项；
 *  PUT 修改已有事项，但为了简洁起见，本章会跳过PUT。
 */

var http = require('http');
var server = http.createServer(function (req, res) {
    // 默认情况下，data事件会提供Buffer对象，这是Node版的字节数组。
    // 而对于文本格式的待办事项而言，你并不需要二进制数据，所以最好将流编码设定为ascii或utf8；
    // 这样data事件会给出字符串。这可以通过调用req.setEncoding(encoding)方法设定：

    // 当Node的HTTP解析器读入并解析请求数据时，它会将数据做成data事件的形式，把解析好的数据块放入其中，等待程序处理：
    // 设置数据块的对象 设置成utf-8
    req.setEncoding('utf8');

    // 触发data 事件
    req.on('data', function (chunk) {
        // 数据块默认是个 buffer对象
        console.log('parsed', chunk);
    });

    // 触发end事件
    req.on('end', function () {
        console.log('done parsing');
        res.end();
    });
});

/**
 * 在将待办事项添加到数组中之前，你需要得到完整的字符串。
 * 要得到整个字符串，可以将所有数据块拼接到一起，直到表明请求已经完成的end事件被发射出来。
 * 在end事件出来后，可以用请求体的整块内容组装出item字符串，然后压入items数组中。在添加好事项后，你可以用字符串OK和Node的默认状态码200结束响应。
 */

var url = require('url');
var items = [];
var server = http.createServer(function (req, res) {
    switch (req.mothod) {
        // post 请求
        case 'POST':
            var item = '';
            req.setEncoding('utf8');
            // 触发data 事件
            req.on('data', function (chunk) {
                // item + '' + '' + '';
                item += chunk;            
            });
            // 触发end事件
            req.on('end', function () {
                // push(item);
                items.push(item);
                res.end('OK\n');
            });
            break;
        // get请求
        case 'GET':
            // 优化的get处理器
            var body = items.map(function (item, i) {
                return i + ') ' + item;
            }).json('\n');

            // 设置请求的头
            // 设定Content-Length头
            //为了提高响应速度，如果可能的话，应该在响应中带着Content-Length域一起发送。
            // 对于事项清单而言，响应主体很容易在内存中提前构建好，所以你能得到字符串的长度并一次性地将整个清单发出去。
            // 设定Content-Length域会隐含禁用Node的块编码，因为要传输的数据更少，所以能提升性能。


            // res.setHeader('Content-Length', body.length);

            // body.lengthContent-LengthContent-Length节长度，不是字符长度，并且如果字符串中有多字节字符，两者的长度是不一样的。
            // 为了规避这个问题，Node提供了一个Buffer.byteLength()方法。
            res.setHeader('Content-Length', Buffer.byteLength(body));
            res.setHeader('content-type', 'text/plain; charset="utf-8"');
            res.end(body);
            
            // items.forEach(function (item, i) {
            //     res.write(i + ') ' + item + '\n');
            // });
            // res.end();
            break;
        case 'DELETE':
            var path = url.parse(req.url).pathname;
            var i = parseInt(path.slice(1), 10);

            if (isNaN(i)) {
                res.statusCode = 400;
                res.end('Invalid item id');
            } else if (!items[i]) {
                res.statusCode = 404;
                res.end('Item not fount');
            } else {
                items.splice(i, 1);
                res.end('OK\n');
            }
            break;
        case 'PUT':

            break;

    }
});
 





