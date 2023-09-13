promise 回调函数会自动执行

如果不执行resolve 或 reject 不会执行 then 方法

如果调用 reject失败时。后续任意的一个.then 方法中`必须`有第二个reject回调函数 或则 有.catch回调函数，不然会报`Uncaught (in promise)`这个错误

多个后续.then 的resolve都会执行，没有接收到结果是 值为`undefined`




promise 方法理解

promise 是一个状态机  三种状态 pending、fulfilled、rejected 状态不可逆

resolve, reject 是触发器 

.then 和 .catch 属于一个监听器  监听promise的状态结果

.then监听器方法, 第一函数是监听resolve,
