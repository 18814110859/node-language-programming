/**
 * 这段脚本中定义了一个可以下载指定版本Node源码的辅助函数。
 * 然后串行执行了两个任务：并行下载两个版本的Node，然后将下载好的版本归档到一个新文件中。
 */

var flow = require('nimble');
var exec = require('child_process').exec;

/**
 * 下载nodeJs版本
 * @param {*} version 
 * @param {*} destination 
 * @param {*} callback 
 */
function downloadNodeVersion(version, destination, callback) {
    var url = 'http://nodejs.org/dist/node-v' + version + '.tar.gz';
    var filepath = destination + '/' + version + 'tgz';
    // 执行服务器 curl命令
    exec('curl ' + url + ' >' + filepath, callback);
}

// 按照顺序执行串行任务
flow.series([
    function (callback) {
        flow.parallel([
            function (callback) {
                console.log('Downloading node v0.4.6...');
                downloadNodeVersion('0.4.6', '/tmp', callback);
            },
            function (callback) {
                console.log('Downloading node v0.4.6...');
                downloadNodeVersion('0.4.7', '/tmp', callback);
            }
        ], callback);
    },
    function (callback) {
        console.log('creating archive of downloaded files...');
        // 创建归档文件
        exec(
            'tar cvf node_distros.tar /tmp/0.4.6.tgz /tmp/0.4.7.tgz',
            function (error, stdout, stderr) {
                callback();
            }

        );
    }
]);


