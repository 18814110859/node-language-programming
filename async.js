
/**
 * 在创建异步程序时，你必须密切关注程序的执行流程，并瞪大眼睛盯着程序的状态：事件轮
 * 询的条件、程序变量，以及其他随着程序逻辑执行而发生变化的资源。
 * 比如说，Node的事件轮询会跟踪还没有完成的异步逻辑。只要有未完成的异步逻辑，Node
 * 进程就不会退出。一个持续运行的Node进程对Web服务器之类的应用来说很有必要，但对于命令
 * 行工具这种经过一段时间后就应该结束的应用却意义不大。事件轮询会跟踪所有数据库连接，直
 * 到它们关闭，以防止Node退出。
 * 如果你不小心，程序的变量也可能会出现意想不到的变化。代码清单3-14是一段可能因为执
 * 行顺序而导致混乱的异步代码。如果例子中的代码能够同步执行，你可以肯定输出应该是“The
 * color is blue”。可这个例子是异步的，在console.log执行之前color的值还在变化，所以输出
 * 是“The color is green”。
 * 用JavaScript闭包可以“冻结”color的值。在代码清单3-15中，对asyncFunction的调用
 * 被封装到了一个以color为参数的匿名函数里。这样你就可以马上执行这个匿名函数，把当前的
 * color的值传给它。而color变成了匿名函数的参数，也就是这个匿名函数内部的本地变量，当
 * 匿名函数外面的color值发生变化时，本地版的color不会受影响。
 * 闭包 要了解闭包的详细信息，请参见Mozilla JavaScript文档：https://developer.
 * mozilla.org/en-US/docs/JavaScript/Guide/Closures。
 * 现在你知道怎么用闭包控制程序的状态了，接下来我们看看怎么让异步逻辑顺序执行，好让
 * 你可以掌控程序的流程。
 */

function asyncFunction(callback) {
  setTimeout(callback, 200);
}

var color = 'blue';

// 正常的函数调用
asyncFunction(function () {
  console.log("The color is " + color);
});

// 使用一个闭包来冻结color 的值
(function (color) {
  asyncFunction(function () {
    console.log("The color is " + color);
  });
})(color)

color = 'green';

/**
 * 3.3 异步逻辑的顺序化
 * 在异步程序的执行过程中，有些任务可能会随时发生，跟程序中的其他部分在做什么没关系，
 * 什么时候做这些任务都不会出问题。但也有些任务只能在某些特定的任务之后做。
 * 让一组异步任务顺序执行的概念被Node社区称为流程控制。这种控制分为两类：串行和并行，
 */

/**
 * 3.3.1 什么时候使用串行流程控制
 * 可以使用回调让几个异步任务按顺序执行，但如果任务很多，必须组织一下，否则过多的回
 * 调嵌套会把代码搞得很乱。
 * 下面这段代码就是用回调让任务顺序执行的。这个例子用setTimeout模拟需要花时间执行
 * 的任务：第一个任务用一秒，第二个用半秒，最后一个用十分之一秒。setTimeout只是一个人
 * 工模拟，在真正的代码中可能是读取文件，发起HTTP请求等。这段代码虽然不长，但它也可以
 * 算是比较乱的了，并且也没有比较简单的添加任务的办法。
 */
setTimeout(function () {
  console.log('I execute first.');
  setTimeout(function (){
    console.log('I execute next.');
    setTimeout(function () {
      console.log('I execute last.');
    });
  })
});


/**
 * 此外，你也可以用Nimble这样的流程控制工具执行这些任务。Nimble用起来简单直接，并且
 * 它的代码量很小（经过缩小化和压缩后只有837个字节）。下面这个命令是用来安装Nimble的：
 */
var flow = require('nimble');
flow.serise([
  function (callback) {
    setTimeout(function () {
      console.log('I execute first.');
      callback();
    }, 1000);
  },
  function (callback) {
    setTimeout(function () {
      console.log('I execute next.');
      callback();
    }, 500)
  },
  function (callback) {
    setTimeout(function () {
      console.log('I execute last.');
      callback();
    }, 100)
  }
]);


尽管这种用流程控制实现的版本代码更多，但通常可读性和可维护性更强。你一般也不会一
直用流程控制，但当碰到想要躲开回调嵌套的情况时，它就会是改善代码可读性的好工具。
看过这个用特制工具实现串行化流程控制的例子之后，我们来看看如何从头开始实现它。


为了用串行化流程控制让几个异步任务按顺序执行，需要先把这些任务按预期的执行顺序放
到一个数组中。如图3-10所示，这个数组将起到队列的作用：完成一个任务后按顺序从数组中取
出下一个。

数组中的每个任务都是一个函数。任务完成后应该调用一个处理器函数，告诉它错误状态和
结果。如果有错误，处理器函数会终止执行；如果没有错误，处理器就从队列中取出下一个任务
执行它。
为了演示如何实现串行化流程控制，我们准备做个小程序，让它从一个随机选择的RSS预订
源中获取一篇文章的标题和URL，并显示出来。RSS预订源列表放在一个文本文件中。这个程序
的输出是像下面这样的文本：

我们这个例子需要从npm存储库中下载两个辅助模块。先打开命令行，输入下面的命令给例
子创建个目录，然后安装辅助模块：
