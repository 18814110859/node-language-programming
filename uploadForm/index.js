
// 要正确处理上传的文件，并接收到文件的内容，需要把表单的enctype属性设为multipart/form-data，这是个适用于BLOB（大型二进制文件）的MIME类型。
// 以高效流畅的方式解析文件上传请求并不是个简简单单的任务，我们不会在本书中讨论其中的细节。
// Node社区中有几个可以完成这项任务的模块。formidable就是其中之一，它是由FelixGeisendörfer为自己的创业公司Transloadit创建的，用于媒体上传和转换，性能和可靠性很关键。
// formidable的流式解析器让它成为了处理文件上传的绝佳选择，也就是说它能随着数据块的上传接收它们，解析它们，并吐出特定的部分，就像我们之前提到的部分请求头和请求主体。
// 这种方式不仅快，还不会因为需要大量缓冲而导致内存膨胀，即便像视频这种大型文件，也不会把进程压垮。
// 现在回到我们照片分享的例子上。下面这个清单中的HTTP服务器实现了文件上传服务器的起始部分。
// 它用HTML表单响应GET请求，还有一个处理POST请求的空函数，我们会在这个函数中集成formidable来处理文件上传。


var http = require('http');
var formidable = require('formidable');

var server = http.createServer(function (req, res) {
    if (req.url == '/') {
        switch (req.method) {
            case "GET":
                show(res);
                break;
            case "POST":
                upload(req, res);
                break;
        }
    }
});




/**
 * 待办事项列表页面
 * @param {*} res 
 */
function show(res) {
    var html = '';
        html += '<form method="post" action="/" enctype="multipart/form-data" >';
        html += '<p><input type="text" name="item" /></p>';
        html += '<p><input type="file" name="file" /></p>';
        html += '<p><input type="submit" value="Upload" /></p>';
        html += '</form></body></html>';
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}


// 料理好GET请求，该实现upload()函数了。当有POST请求进来时，会调用这个回调函数。
// upload()函数需要接收传入的上传数据，我们把这个交给formidable处理。本节后续内容会介绍
// 集成formidable需要完成哪些工作：
// (1) 通过npm安装formidable；
// (2) 创建一个IncomingForm实例；
// (3) 调用form.parse()解析HTTP请求对象；
// (4) 监听表单事件field、file和end；
// (5) 使用formidable的高层API。
// 要在项目中使用formidable，第一步就是安装它。运行下面这条命令就可以了，它会把这个
// 模块装到项目内的./node_modules目录下：
// npm install formidable


/**
 * 文件上传
 * @param {*} req 
 * @param {*} res 
 */
function upload(req, res) {
    if (!isFormData(req)) {
        res.statusCode = 400;
        res.end('Bad Request: expecting multipart/form-data');
        return;
    }

    // 在你确定了这是一个文件上传请求后，需要初始化一个新的formidable.IncomingForm表单，然后调用form.parse(req)方法，其中的req是请求对象。
    // 这样formidable就可以访问请求的data事件进行解析了：
    // IncomingForm对象本身会发出很多事件，默认情况下，它会把上传的文件流入/tmp目录下。
    // 如下所示，在处理完表单元素后，formidable会发出事件。比如说，在收到文件并处理好后会发出file事件，收完输入域后会发出field事件。

    var form = new formidable.IncomingForm();
    // field 事件
    form.on('field', function (field, value) {
        console.log(field);
        console.log(value);
    });
    
    // file 事件
    form.on('file', function (name, file) {
        console.log(anem);
        console.log(file);
    });
    // end 事件
    form.on('end', function () {
        res.end('upload complete!');
    });

    form.parse(req, function (errer, fields, files) {
        console.log(fields);
        console.log(files);
        res.end('upload complete!');
    });

    // Formidable的progress事件能给出收到的字节数，以及期望收到的字节数。我们可以借助这个做出一个进度条。在下面这个例子中，每次有progress事件激发，就会计算百分比并用console.log 输出
    form.on('progress', function (bytesReceived, bytesExpected) {
        // 当前上传的文件大小 / 文件的期望的实际大小 * 100 然后浮点数 进一位取整
        var percent = Math.floor(bytesReceived / bytesExpected * 100);
        console.log(percent);
    });
}





/**
 * 辅助函数isFormData()用String.indexOf()方法检查请求头中的Content-Type字段，断言它的值是以multipart/form-data开头的。
 * @param {*} req 
 */
function isFormData(req) {
    var type = req.headers['content-type'] || '';
    return 0 == type.indexOf('multipart/form-data');
}



server.listen(3000);
