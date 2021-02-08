/**
 * 单词的统计脚本 （并行化流程控制）
 * 
 * 为了让异步任务并行执行，仍然是要把任务放到数组中，但任务的存放顺序无关紧要。
 * 每个任务都应该调用处理器函数增加已完成任务的计数值。当所有任务都完成后，处理器函数应该执行后续的逻辑。
 * 我们会做一个简单的程序作为并行化流程控制的例子，它会读取几个文本文件的内容，并输出单词在整个文件中出现的次数。
 * 我们会用异步的readFile函数读取文本文件的内容，所以几个文件的读取可以并行执行。
 */

 
var fs = require('fs');
var completedTasks = 0;
var tasks = [];
var wordCounts = {};
var filesDir = './text';


/**
 * 读取text目录下的文件列表
 */
fs.readFile(filesDir, function (err, files) {
    if (err) throw err;
    for (var index in files) {
        // 定义处理每个文件的任务。
        // 每个任务中都会调用一个异步读取文件的函数并对文件使用单词计数
        var task = (function (file) {
            // file = filesDir + '/' + files[index];
            return function () {
                // 读文件
                fs.readFile(file, function (err, text) {
                    if (err) throw err;
                    countWordsInText(text);
                    checkIfComplete();
                });
            }
        })(filesDir + '/' + files[index]);
        // 把所有的任务都添加到函数调用的数组中
        tasks.push(task);
    }

    // 开始执行 tasks 中的任务
    for (var task in tasks) {
        tasks[task]();
    }
});


/**
 * 统计文本的单词数
 * @param {*} text 
 */
function countWordsInText(text) {
    var words = text.toString().toLowerCase(/\W+/).sort();
    for (var index in words) {
        var word = words[index];
        if (word) {
            wordCounts[word] = (wordCounts[word]) ? wordCounts[word] + 1 : 1;
        }
    }
}

/**
 * 当所有任务全部完成后，
 * 列出文件中用到的每个单词以及用了多少次
 */
function checkIfComplete() {
    completedTasks++;
    // 判断任务是否全部完成
    if (completedTasks == tasks.length) {
        // 列出文件中用到的每个单词以及用了多少次
        for (var index in wordCounts) {
            console.log(index + ': ' + wordCounts[index]);
        }
    }
}


