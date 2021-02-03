/**
 * 在错误处理上有个常规做法，你可以创建发出error类型事件的事件发射器，而不是直接抛出错误。
 * 这样就可以为这一事件类型设置一个或多个监听器，从而定义定制的事件响应逻辑。
 */
var events = require('events');
// 新建一个事件发射器的对象
var Emitter = new events.EventEmitter();
Emitter.on('error', function (err) {
    console.log('ERROR: ' + err.message);    
});

// var Logger = function () {
// }


// Logger.prototype.hadError = function (err, res) {
//     console.error(err);
//     res.end('server error');
// }

// module.exports = Logger;

