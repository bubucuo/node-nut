// let setTimeout = (fn, timeout, ...args) => {
//   const start = new Date();
//   let timer, now;
//   const loop = () => {
//     timer = window.requestAnimationFrame(loop);
//     now = new Date();
//     if (now - start >= timeout) {
//       fn.apply(this, args);
//       window.cancelAnimationFrame(timer);
//     }
//   };
//   window.requestAnimationFrame(loop);
// };

// function showName() {
//   console.log("hello"); //sy-log
// }

// let timerId = setTimeout(showName, 1000);

function setTimeout(callback, after) {
  // 1. 实例化一个Timeout对象，保存回调、超时时间等数据，是超时哈希队列的节点
  const timeout = new Timeout(callback, after);
  // 2. 启动超时器
  insert(timeout, timeout._idleTimeout);

  // 3. 返回一个对象
  return timeout;
}

// *************timer.js**********

let timerListId = Number.MIN_SAFE_INTEGER; //NumberMIN_SAFE_INTEGER;
// ! 常量
const activeTimersMap = Object.create(null);

// Symbols for storing async id state.
const async_id_symbol = Symbol("asyncId");
const trigger_async_id_symbol = Symbol("triggerId");

let nextExpiry = Infinity;

// 优先队列（先根据过期时间比较，相等的话再比较id）
const timerListQueue = new PriorityQueue(compareTimersLists, setPosition);
function compareTimersLists(a, b) {
  const expiryDiff = a.expiry - b.expiry;
  if (expiryDiff === 0) {
    if (a.id < b.id) return -1;
    if (a.id > b.id) return 1;
  }
  return expiryDiff;
}
function setPosition(node, pos) {
  node.priorityQueuePosition = pos;
}

// Timeout构造函数
function Timeout(callback, after) {
  this._idleTimeout = after;
  this._idlePrev = this;
  this._idleNext = this;
  this._idleStart = null;

  // 为了避免隐藏类里的函数追踪，必须先设置成null
  this._onTimeout = null;
  this._onTimeout = callback;

  this._repeat = isRepeat ? after : null;
  this._destroyed = false;

  //   this[kHasPrimitive] = false;

  initAsyncResource(this, "Timeout");
}

function initAsyncResource(resource, type) {
  const asyncId = (resource[async_id_symbol] = newAsyncId());
  const triggerAsyncId = (resource[getDefaultTriggerAsyncId] =
    getDefaultTriggerAsyncId());
  //   if (initHooksExist()) {
  //     emitInit(asyncId, type, triggerAsyncId, resource);
  //   }
  activeTimersMap[asyncId] = { type, resource };
}

const timerListMap = Object.create(null);

function insert(item, msecs, start = performance.now()) {
  item._idleStart = start;

  let list = timerListMap[msecs];
  // 没有则新建一个队列
  if (list === undefined) {
    const expiry = start + msecs;
    timerListMap[msecs] = list = new TimersList(expiry, msecs);
    timerListQueue.insert(list);
    if (nextExpiry > expiry) {
      scheduleTimer(msecs);
      nextExpiry = expiry;
    }
  }
  //  把超时节点插入超时队列
  L.append(list, item);
}

function TimersList(expiry, msecs) {
  this._idleNext = this;
  this._idlePrev = this;
  this.expiry = expiry;
  this.id = timerListId++;
  this.msecs = msecs;
  this.priorityQueuePosition = null;
}
