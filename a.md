promise 回调函数会自动执行

如果不执行resolve 或 reject 不会执行 then 方法

如果调用 reject失败时。后续任意的一个.then 方法中`必须`有第二个reject回调函数，不然会报`Uncaught (in promise)`这个错误

多个后续.then 的resolve都会执行，没有接收到结果是 值为`undefined`