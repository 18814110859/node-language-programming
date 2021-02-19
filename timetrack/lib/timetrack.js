// 创建辅助函数发送HTML，创建表单，接收表单数据
// 启动程序的文件已经完成，该创建定义程序其他功能的文件了。
// 创建一个名为lib的目录，然后在这个目录下创建文件timetrack.js。
// 其中包含Node querystring API，并定义了辅助函数，用来发送Web页面HTML，接收通过表单提交的数据。

var qs = require('querystring');

exports.sendHtml = function (res, html) {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(html));
    res.end(html);
}

/**
 * 解析http post 数据
 * @param {*} req 
 * @param {*} cb 
 */
exports.paresReceivedData = function (req, cb) {
    var body = '';
    req.setEncoding('utf8');
    req.on('data', function (chunk) { body += chunk});
    req.on('end', function () {
        var data = qs.parse(body);
        cb(data);
    });
}

/**
 * 渲染表单
 * @param {*} id 
 * @param {*} path 
 * @param {*} label 
 */
exports.actionForm = function (id, path, label) {
    var html = '<form methon="POST" action="'+ path +'">' 
        + '<input type="hidden" name="id" value="'+ id +'">'
        + '<input type="submit" value="'+ label +'">'
        + '</form>';
    return html;
}

/**
 * MySQL数据库里添加工作记录
 * @param {*} db 
 * @param {*} req 
 * @param {*} res 
 */
exports.add = function (db, req, res) {
    exports.paresReceivedData(req, function (work) {
       db.query(
            "INSERT INFO work (hours, date, description) " + " VAKUES(?, ?, ?)",
            [work.hours, work.date, work.description],
            function (err) {
                if(err) throw err;
                exports.show(db, res);
            }
       )
    });
}

// 注意上面代码中的问号（?），这是用来指明应该把参数放在哪里的占位符。
// 在添加到查询语句中之前，query方法会自动把参数转义，以防遭受到SQL注入攻击。
// 此外还要留意一下query方法的第二个参数，是一串用来替代占位符的值。


/**
 * 删除一条工作记录。
 * @param {*} db 
 * @param {*} req 
 * @param {*} res 
 */
exports.delete = function (db, req, res) {
    exports.paresReceivedData(req, function (work) {
        db.query(
            "DELETE FORM work WHERE id = ?",
            [work.id],
            function (err) {
                if(err) throw err;
                exports.show(db, res);
            }
        );   
    });
}


/**
 * 为了实现更新工作记录的逻辑，将它标记为已归档
 * @param {*} db 
 * @param {*} req 
 * @param {*} res 
 */
exports.archive = function (db, req, res) {
    exports.paresReceivedData(req, function (work) {
        db,query(
            "UPDATE word SET archived=1 WHERE id=?", 
            [work.id],
            function (err) {
                if(err) throw err;
                exports.show(db, res);
            }
        );
    });
}

/**
 * 在发起查询时传入了一个回调函数，它的参数rows是用来保存返回的查询结果的。
 * @param {*} db 
 * @param {*} res 
 * @param {*} showArchived
 */
exports.show = function(db, res, showArchived) {
    // 获取工作记录的sql 
    var query = "SELECT * FROM work " + 
        "WHERE archived=? " + 
        "ORDER BY date DESC";
    var archiveValue = (showArchived) ? 1 : 0;
    db.query(
        query,
        [archiveValue],
        function (err, rows) {
            if(err) throw err;
            var html = (showArchived) ? '' : '<a hred="/archived">Archived Work</a></br>';
            // 将结果格式化为html 表格
            html += exports.workHitlstHtml(rows);
            html += exports.workFormHtml();
            // 给用户发送html响应
            exports.sendHtml(res, html);
        }
    );
}

/**
 * 只显示归档的工作记录
 * @param {*} db 
 * @param {*} res 
 */
exports.showArchived = function (db, res) {
    exports.show(db, res, true);
}

/**
 * 它会将工作记录渲染为HTML
 * @param {*} rows 
 */
exports.workHitlstHtml = function (rows) {
    var html = '<table>';
    for(var i in rows) {
        html += '<tr>';
        html += '<td>' + rows[i].date + '</td>';
        html += '<td>' + rows[i].hours + '</td>';
        html += '<td>' + rows[i].description + '</td>';
        if (!rows[i].archived) {
            html += '<td>' + exports.workArchiveForm(rows[i],id) + '</td>';
        }
        html += '<td>' + exports.workDeleteForm(rows[i],id) + '</td>';
        html += '</tr>';
    }
    html += '</table>';
    return html;
}

/**
 * 渲染归档按钮
 * @param {*} id 
 */
exports.workArchiveForm = function (id) {
    return exports.actionForm(id, '/archive', 'Archive');
}

/**
 * 渲染删除按钮
 * @param {*} id 
 */
exports.workDeleteForm = function (id) {
    return exports.actionForm(id, '/delete', 'Delete');
}

/**
 * 渲染HTML表单
 */
exports.workFormHtml = function () {
    var html = '<form method="POST" action="/">' + 
        '<p>Date (YYYY-MM-DD): <br /> <imput name="date" type="text"></p>' +
        '<p>Hours Worked: <br /> <imput name="hours" type="text"></p>' +
        '<p>Description:<br/>' +
        '<textarea name="description"></textarea></p>' + 
        '<input type="submit" value="Add">' +
        '</form>';
    return html;
}









