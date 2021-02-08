/**
 * 扩展事件监听器：文件监视器
 * 如果你想在事件发射器的基础上构建程序，可以创建一个新的JavaScript类继承事件发射器。
 * 比如创建一个Watcher类来处理放在某个目录下的文件。然后可以用这个类创建一个工具，该工
 * 具可以监视目录（将放到里面的文件名都改成小写），并将文件复制到一个单独目录中。
 * 扩展事件发射器需要三步：
 * (1) 创建类的构造器；
 * (2) 继承事件发射器的行为；
 * (3) 扩展这些行为。
 */
// Watcher类的构建器，
// 它的两个参数分别是要监控的目录和放置修改过的文件的目录
function Watcher(watchDir, processedDir) {
    this.watchDir = watchDir;
    this.processedDir = processedDir;
}

//添加继承事件的发射器行为
var events = require('events');
var util = require('util');
util.inherits(Watcher, events.EventEmitter);
// 注意inherits函数的用法，它是node内置的util模块里的。
// 用inherits函数继承另一个对象额行为看起来很简洁
// 等同于 Watcher.prototype = new events.EventEmitter();



var fs = require('fs');
//扩展 EventEmitter, 添加处理文件的方法
Watcher.prototype.watch = function() {
    var watcher = this;
    // 保存对 watcher 对象的引用，以便在回调函数readdir
    fs.readdir(this.watchDir, function (err, files) {
      if (err) throw err;
      for (var index in files) {
        // 处理watch 目录的所有文件
        watcher.emit('process', files['index']);
      }
    });
}

/**
 * watch方法循环遍历目录，处理其中的所有文件。start方法启动对目录的监控。
 * 监控用到了Node的fs.watchFile函数，所以当被监控的目录中有事情发生时，
 * watch方法会被触发，循环遍历受监控的目录，并针对其中的每一个文件发出process事件。
 */

//扩展 EventEmitter, 添加开始的方法
Watcher.prototype.start = function () {
  var watcher = this;
  fs.watchFile(watchDir, function () {
    watcher.watch();
  });
}


var watchDir = './watch';
var processedDir = './done';
// 创建一个 watcher 对象
var watcher = new Watcher(watchDir, processedDir);

//用继承自事件发射器类的on方法设定文件的处理逻辑
watcher.on('progress', function (file) {
  var watchFile = this.watchDir + '/' + file;
  var processedDir = this.processedDir + '/' + file.toLowerCase();
  fs.rename(watchFile, processedDir, function (err) {
    if (err) throw err;
  })
});

// 启动对目录的监控
watcher.start();


/**
 * 通过学习如何使用回调定义一次性异步逻辑，以及如何用事件发射器重复派发异步逻辑，你
 * 离掌控Node程序的行为又近了一步。
 * 然而你可能还想在单个回调或事件发射器的监听器中添加新的异步任务。
 * 如果这些任务的执行顺序很重要，你就会面对新的难题：如何准确控制一系列异步任务里的每个任务。
 */
