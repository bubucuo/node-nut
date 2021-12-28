const PriorityQueue = require("./priority_queue");

function Timeout(callback, after) {
  this._idleTimeout = after;

  this._onTimeout = null;
  this._onTimeout = callback;
}

// 构建字典结构 key(number):value

const timerListMap = Object.create(null);
let timerListId = NumberMIN_SAFE_INTEGER;
// 全局定义优先队列
const timerListQueue = new PriorityQueue(compareTimersLists, setPosition);
// 定义节点比较函数
function compareTimersLists(a, b) {
  const expiryDiff = a.expiry - b.expiry;
  if (expiryDiff === 0) {
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
  }
  return expiryDiff;
}
// 修改节点优先值
function setPosition(node, pos) {
  node.priorityQueuePosition = pos;
}

function insert(item, msecs, start = Date.now()) {
  item._idleStart = start;
  let list = timerListMap[msecs];

  if (list === undefined) {
    // 过期时间点，msecs是过期时间段
    const expiry = start + msecs;
    timerListMap[msecs] = list = new TimersList(expiry, msecs);
    // 插入优先队列
    timerListQueue.insert(list);
  }
}

function TimersList(expiry, msecs) {
  this._idleNext = this; // Create the list with the linkedlist properties to
  this._idlePrev = this; // Prevent any unnecessary hidden class changes.
  this.expiry = expiry;
  this.msecs = msecs;
  this.id = timerListId++;
  this.priorityQueuePosition = null;
}

module.exports = { Timeout, insert };
