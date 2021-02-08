/**
 * 随机选择的RSS预订源中获取一篇文章的标题和URL，并显示出来。RSS预订源列表放在一个文本文件中 （串行化流程控制）
 * 
 * 为了用串行化流程控制让几个异步任务按顺序执行，需要先把这些任务按预期的执行顺序放到一个数组中。
 * 这个数组将起到队列的作用：完成一个任务后按顺序从数组中取出下一个。
 * 数组中的每个任务都是一个函数。任务完成后应该调用一个处理器函数，告诉它错误状态和结果。如果有错误，处理器函数会终止执行；如果没有错误，处理器就从队列中取出下一个任务执行它。
 * request模块是个经过简化的HTTP客户端，你可以用它获取RSS数据。htmlparser模块能把原始的RSS数据转换成JavaScript数据结构。
 */

var fs = require('fs');
var request = require('request');
var htmlparser = require('htmlparser');
var configFilename = './rss_feeds.txt';

// 把所有要做的任务按照执行的顺序添加到一个数组中
var tasks = [
    checkForRSSFile,
    readRSSFile,
    downloadRSSFeed,
    parseRSSFeed
];

/**
 * 负责执行任务的next函数
 * @param {*} err 
 * @param {*} result 
 */
function next(err, result) {
    if (err) throw err;
    // 从任务数组中取出下一个任务
    var currentTask = tasks.shift();
    if (currentTask) {
        currentTask(result);
    }
}

// 开始执行
next();


/**
 * 确保包含Rss 预订源URL列表文件存在
 */
function checkForRSSFile() {
    fs.exists(configFilename, function (exists) {
        if (!exists) {
            // 文件不存在则报错
            return next(new Error('Missing RSS file:' + configFilename));// 报错打断任务
        }
        next(null, configFilename);// 执行下一个任务
    })
}


/**
 * 读取并解析文件
 * @param {*} configFilename 
 */
function readRSSFile (configFilename) {
    fs.readFile(configFilename, function (err, feedList) {
        if (err) return next(err);// 报错打断任务
        // 将url列表转换成字符串，然后分隔成一个数组
        feedList = feedList.toString().replace(/^\s+|\s+$/g, '').split("\n");
        var random = Math.floor(Math.random() * feedList.length);
        next(null, feedList[random]);// 执行下一个任务
    });
}

/**
 * 将指定的资源发送http请求以获取数据
 * (request模块是个经过简化的HTTP客户端，你可以用它获取RSS数据)
 * @param {*} feedUrl 
 */
function downloadRSSFeed (feedUrl) {
    request({uri: feedUrl}, function (err, res, body) {
        if (err) return next(err);
        if (res.stutusCode != 200) {
            return next(new Error('Abnormal response status code!'));// 报错打断任务
        }
        next(null, body)// 执行下一个任务
    });

}

/**
 * 将预订源数据解析到一个数组中
 * @param {*} rss 
 */
function parseRSSFeed(rss) {
    /**
     * 解析 预订源
     */
    var handler = new htmlparser.RssHandler();
    var parser = new htmlparser.Parser(handle);
    parser.parseComplete(rss);
    
    
    if (handler.dom.items.length == 0) {
        return next(new Error('No RSS items found'));// 报错打断任务
    }

    // 打印所有的
    console.log(handler);
    
    var item = handler.dom.items.shift();
    // 打印第一条预订源的标题和URl
    console.log(item.title);
    console.log(item.link);
}






