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
                
                break;
            case "POST":

                break;
            default:
                
                break;
        }
    }

});

/**
 * 待办事项列表页面
 * @param {*} res 
 */
function show(res) {
    
}

/**
 * 资源不存在
 * @param {*} res 
 */
function notFound(res) {
    
}

/**
 * 无效的请求
 * @param {*} res 
 */
function badRequest(res) {
    
}

function add(req, res) {
    
}

server.listen(3000);

// 为了简单起见，这个例子假定Content-Type是application/x-www-form-urlencoded，这也是HTML表单的默认值。
// 要解析数据，只需把data事件的数据块拼接到一起形成完整的请求主体字符串。因为不用处理二进制数据，所以可以用res.setEncoding()将请求编码类型设为utf8。
// 在请求发出end事件后，所有data事件就完成了，整个请求体也会变成字符串出现在body变量中。


// 对于包含一点JSON、XML或类似小块数据的请求主体，缓冲很好用，但缓冲这个数据可
// 能会有问题。如果缓冲区的大小设置不正确，很可能会让程序出现可用性漏洞，这个我们在第
// 7章再展开讨论。因此，比较好的作法是实现一个流式解析器，降低对内存的要求，防止过度
// 消耗资源。尽管更难使用和实现，但这个处理会随着数据块的不断发出做增量式解析。

// 在add()函数中解析请求主体时，用到了Node的querystring模块。来看看在REPL中的快速演
// 示，了解下Node服务器中用到的这个querystring.parse()函数是如何解析请求主体的。
// 假设用户通过HTML表单向待办事项列表中提交了文本“take ferrets to the vet”：





