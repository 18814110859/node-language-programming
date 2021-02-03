var currency = require('./currency');


var us = currency.canadianToUS(50);
console.log(us);

var canadian = currency.USToCanadian(30);
console.log(canadian);





var Currency = require('./currency_obj');
var canadianDollar = 0.91;
var currencyObj = new Currency(canadianDollar);
var us = currencyObj.canadianToUS(50);
console.log(us)

// 用 node_modules 用重用模块
// 要求模块在文件系统中使用相对路径存放，对于组织程序特定的代码很有帮助，但对于想要
// 在程序间共享或跟其他人共享代码却用处不大。Node中有一个独特的模块引入机制，可以不必知
// 道模块在文件系统中的具体位置。这个机制就是使用node_modules目录。

