// 4.3 提供静态文件服务
// 很多Web程序的需求即使不完全相同，也是相似的，而静态文件 （CSS、JavaScript、图片）
// 服务肯定是其中之一。尽管写一个健壮而又高效的静态文件服务器没什么了不起的，因为在Node
// 社区中也已经有一些健壮的实现了，但跟着本节的介绍做一个自己的静态文件服务器对你了解
// Node的底层文件系统API很有帮助。
// 你将从本节中学到如何
//  创建一个简单的静态文件服务器；
//  用pipe()优化数据传输；
//  通过设定状态码处理用户和文件系统错误。
// 我们先从创建一个提供静态资源服务的简单HTTP服务器开始。
        
// 4.3.1 创建一个静态文件服务器
// 像Apache和IIS之类传统的HTTP服务器首先是个文件服务器。现在你手上可能就有个老网站
// 跑在这样的文件服务器上，把它移植过来，在Node上复制这个基本功能对你理解过去所用的HTTP
// 服务器很有帮助。
// 每个静态文件服务器都有个根目录，也就是提供文件服务的基础目录。在你即将要创建的服务器上定义一个root的变量，它将作为我们这个静态文件服务器的根目录


// 管道和水管
// 把Node中的管道想象成水管对你理解这个概念很有帮助。比如你想让某个源头（比如热
// 水器）流出来的水流到一个目的地（比如厨房的水龙头），可以在中间加一个管道把它们连起
// 来，这样水就会顺着管道从源头流到目的地。
// Node中的管道也是这样，但其中流动的不是水，而是来自源头（即ReadableStream）
// 的数据，管道可以让它们“流动”到某个目的地（即WritableStream）。你可以用pipe方法
// 把管道连起来：
// ReadableStream.pipe(WritableStream); 
// 读取一个文件（ReadableStream）并把其中的内容写到另一个文件中（WritableStream）用
// 的就是管道：
// var readStream = fs.createReadStream('./original.txt') 
// var writeStream = fs.createWriteStream('./copy.txt') 
// readStream.pipe(writeStream); 
// 所有ReadableStream都能接入任何一个WritableStream。比如HTTP请求（req）对
// 象就是ReadableStream，你可以让其中的内容流动到文件中：
// req.pipe(fs.createWriteStream('./req-body.txt')) 
// 要深入了解Node中的数据流，包括它内置的各种数据流实现，请参阅Github上的数据流手
// 册：https://github.com/substack/stream-handbook。



var http = require('http');
var parse = require('url').parse;
var join = require('path').join;
var fs = require('fs');

var root = __dirname;

var server = http.createServer(function (req, res) {
    var url = parse(req.url);
    // 构建绝对路径
    var path = join(root, url.pathname);

    // 4.3.3 用fs.stat()实现先发制人的错误处理
    // 因为传输的文件是静态的，所以我们可以用stat()系统调用获取文件的相关信息，比如修改时间、字节数等。
    // 在提供条件式GET支持时，这些信息特别重要，浏览器可以发起请求检查它的缓存是否过期了。
    // 重构后的文件服务器如代码清单4-4所示，其中调用了fs.stat()用于得到文件的相关信息，比如它的大小，或者得到错误码。
    // 如果文件不存在，fs.stat()会在err.code中放入ENOENT作为响应，然后你可以返回错误码404，向客户端表明文件未找到。
    // 如果fs.stat()返回了其他错误码，你可以返回通用的错误码500。
    fs.stat(path, function (err, stat) {
        // 检查文件是否存在
        if (err) {
            // 文件不存在
            if ('ENOENT' == err.code) {
                res.statusCode = 404;
                res.end("Not Found");
            } else {
                res.statusCode = 500;
                res.end("Internal server Error");
            }
        } else {
            // 用 stat 对象的属性设置 Content-Length 
            res.setHeader('Content-Length', stat.size);

            var stream = fs.createReadStream(path);
            stream.pipe(res);
            stream.on('error', function (err) {
                res.statusCode = 500;
                res.end("Internal server Error");
            });
        }
    });

    // 有了文件的路径，还需要传输文件的内容。这可以用高层流式硬盘访问fs.ReadStream完成，它是Node中Stream类之一。
    // 这个类在从硬盘中读取文件的过程中会发射出data事件。下面这个代码清单中的代码实现了一个简单但功能完备的文件服务器。 
    // 构建fs.readStream
    // var stream = fs.createReadStream(path);

    // stream.on('data', function (chunk) {
    //     // 将文件写在响应中
    //     res.write(chunk);
    // });
    // stream.on('end', function () {
    //     // 文件写完后结束响应
    //     res.end();
    // });

    // 用STREAM.PIPE()优化数据传输
    // 尽管了解fs.ReadStream的工作机制以及它那种事件方式的灵活性很重要，但Node还提供了更高级的实现机制：Stream.pipe()。用这个方法可以极大简化服务器的代码。
    // res.end() 会在 stream.pipe() 内部调用 
    // 文件 ReadStream 通过管道传到 http 响应中完成客户端的请求
    // stream.pipe(res);

    // 4.3.2 处理服务器错误
    // 我们的静态文件服务器还没有处理因使用fs.ReadStream可能出现的错误。如果你访问不存在的文件，或者不允许访问的文件，或者碰到任何与文件I/O有关的问题，当前的服务器会抛出错误。
    // 我们将在本节中介绍如何让文件服务器，或其他任何Node服务器变得更加健壮。
    // 在Node中，所有继承了EventEmitter的类都可能会发出error事件。像fs.ReadStream这样的流只是专用的EventEmitter，有预先定义的data和end等事件，我们已经看过了。
    // 默认情况下，如果没有设置监听器，error事件会被抛出。也就是说如果你不监听这些错误，那它们就会搞垮你的服务器。
    // 为了说明这个问题，请试着请求一个不存在的文件，比如/notfound.js。
    // 在终端会话中运行服务器，你会看到在stderr中输出的异常的堆栈跟踪消息，像下面这样：
    // 为了防止服务器被错误搞垮，我们要监听错误，在fs.ReadStream上注册一个error事件处理器（比如下面这段代码），返回响应状态码500表明有服务器内部错误：
    // stream.on('error', function (err) {
    //     res.statusCode = 500;
    //     res.end("Internal server Error");
    // });

    // 注册一个error事件处理器，可以捕获任何可以预见或无法预见的错误，给客户端更优雅的响应。
});

server.listen(3000);