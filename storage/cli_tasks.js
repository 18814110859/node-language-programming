// 这个程序会把任务存到文件.tasks中，跟运行的脚本在同一目录下。在保存之前，任务会被转换成JSON格式，从文件中读出来时再从JSON格式转回来。
// 创建这个程序需要编写启动逻辑，并定义获取及存储任务的辅助函数。
// 这段逻辑从引入必需的模块开始，然后解析来自命令行参数的任务命令和描述，并指明用来保存任务的文件。代码如下所示。


var fs = require('fs');
var path = require('path');

// 获取输入的命令
var args = process.argv.slice(2);
// 取出第一个参数
var command = args.shift();

// 合并剩余的参数
var taskDescription = args.join(' ');

// 根据当前的工作目录解析数据库的相对路径
var file = path.join(process.cwd(), '/.tasks');

// 如果你提供了动作参数，程序或者输出已保存任务的列表，或者添加任务描述到任务存储中，代码如下所示。如果没提供参数，则会显示用法帮助。
switch (command) {
    case 'add':
        break;
    case 'list':
        break;
    default:
        break;
}




// 2. 定义获取任务的辅助函数
// 接下来要在程序逻辑中定义一个辅助函数，loadOrInitializeTaskArray，用来获取已有的任务。
// 如代码清单5-3所示，loadOrInitializeTaskArray会从一个文本文件中加载编码为JSON格式的数据。
// 代码中用到了fs模块中的两个异步函数。这些函数是非阻塞的，事件轮询可以继续，无需坐等文件系统返回结果。

/**
 * 
 * @param {*} file 
 * @param {*} cb 
 */
function loadOrInitializeTaskArray(file, cb) {
    fs.exists(file, function (exists) {
        // 判断文件是否存在
        var tasks = [];
        if (exists) {
            fs.readFile(file, 'utf8', function (err, data) {
                if (err) throw err;
                var data = data.toString();
                var tasks = JSON.parse(data || '[]');
                cb(tasks);
            });
        } else {
            cb([]);
        }
    });
}



/**
 * 列出任务列表
 * @param {*} file 
 */
function listTask(file) {
    loadOrInitializeTaskArray(file, function (tasks) {
        for (var i in tasks) {
            console.log(tasks[i]);
        }
    });
}


/**
 * 把任务用JSON串行化后放到文件中。
 * @param {*} file 
 * @param {*} tasks 
 */
function storeTasks(file, tasks) {
    fs.writeFile(file, JSON.stringify(tasks), 'utf8', function (err) {
        if (err) throw err;
        console.log('saved');
    });
}

/**
 * 添加一个任务描述
 * @param {*} file 
 * @param {*} taskDescription 
 */
function addTask(file, taskDescription) {
    loadOrInitializeTaskArray(file, function (tasks) {
        tasks.push(taskDescription);
        storeTasks(file, tasks);
    });
}



// 在添加程序的持久化功能时，用文件系统做数据存储既快捷又容易。用它来保存程序配置也很好。
// 如果程序的配置数据保存在文本文件中，并且编码为JSON格式，前面定义的loadOrInitializeTaskArray也可以用来读取配置文件并解析JSON。
// 第13章会介绍更多与Node操作文件系统有关的知识。接下来我们去看看在程序的数据存储方面一直占据主力位置的关系型数据管理系统。



