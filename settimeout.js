function showName() {
  console.log("hello"); //sy-log
}

// callback, after
let timerId = setTimeout(showName, 1000);

// *************setTimeouts实现*************
const { Timeout, insert } = require("./timers");

function setTimeout(callback, after) {
  // 1. 实例化一个Timeout对象，保存callback, after等数据，生成的timeout对象其实就是超时哈希队列的节点
  const timeout = new Timeout();

  // 2.把对象节点插入队列
  insert(timeout, timeout._idleTimeout);

  //3. 返回timeout对象
  return timeout;
}

// 数据结构中的优先队列
// React中的任务队列与Node setTimeout的任务队列能区分清楚吗
// *1. React中的任务队列
// 任务执行的时候，先执行优先级最高的，也就是小顶堆顶部的值被删除(remove)
// 如果插入任务，就把值插入到小顶堆尾部就行了

// *2. Node setTimeout
// 任务执行的时候，先执行优先级最高的，也就是小顶堆顶部的值被删除(remove)
// 如果插入任务，先插入再调整任务队列
// setTimeout可能会被随时clear掉（remove）

// *总结：插入一样，但是remove不同，React中的remove只能remove小顶堆顶部的值，
// * 但是setTimeout的remove可能remove任何一个位置的值
