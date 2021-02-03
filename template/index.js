var fs = require('fs');
var Logger = require('./../logger')
var logger = new Logger();
/**
 * 获取html
 * @param {*} res 
 */
exports.getHtml = function (res) {
    fs.readFile('./titles.json', function (err, data) {
        if (err) return logger.hadError(err, res);
        getTemplate('index',  JSON.parse(data.toString()), res);
    })
}

/**
 * 读取模版
 * @param {*} templateFile 
 * @param {*} titles 
 * @param {*} res 
 */
 function getTemplate (templateFile, titles, res) {
    var filepath = './template/' + templateFile + '.html';
    fs.readFile(filepath, function (err, data) {
        if (err) return logger.hadError(err, res);
        // 格式下html的模版
        formatHtml(titles, data.toString(), res);
    });
}

/**
 * 格式下html的模版
 * @param {*} titles 
 * @param {*} tmlp 
 * @param {*} res 
 */
function formatHtml (titles, tmlp, res) {
    var html = tmlp.replace('%', titles.join('</li><li>'));
    res.writeHead(200, {'Content-Type': 'text/html'});
    return res.end(html); 
}

/**
 * 输出错误信息到页面
 * @param {*} err 
 * @param {*} res 
 */
function hadError(err, res) {
    console.error(err);
    res.end('server error');
}