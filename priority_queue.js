const kCompare = Symbol("compare");
const kHeap = Symbol("heap");
const kSetPosition = Symbol("setPosition");
const kSize = Symbol("size");

// 优先队列
module.exports = class PriorityQueue {
  constructor(comparator, setPosition) {
    this[kCompare] = comparator;
    this[kSetPosition] = setPosition;
    this[kHeap] = new Array(64);
    this[kSize] = 0;
  }

  //取优先队列优先级别最高的任务
  peek() {
    return this[kHeap][1];
  }

  // 插入元素，为了不破坏原先的结构，所以先把元素插入到尾部，再向上调整
  insert(value) {
    const heap = this[kHeap];
    const pos = ++this[kSize];
    heap[pos] = value;

    if (heap.length === pos) {
      // 扩充
      heap.length *= 2;
    }
    // 向上调整
    this.percolateUp(pos);
  }

  // 向上调整
  percolateUp(pos) {
    const heap = this[kHeap];
    const compare = this[kCompare];
    const setPosition = this[kSetPosition];

    const item = heap[pos];

    while (pos > 1) {
      // 位运算：或
      const parentIndex = (pos / 2) | 0;
      const parent = heap[parentIndex];
      // 父节点<子节点，停止
      if (compare(parent, item) <= 0) {
        break;
      }
      // 否则，交换父节点与子节点的位置
      heap[pos] = parent;
      setPosition(parent, pos);
      pos = (pos / 2) | 0;
    }

    heap[pos] = item;
    setPosition(parent, pos);
  }

  // 删除pos位置的值，pos可能是任何一个有效值
  removeAt(pos) {
    const heap = this[kHeap];

    const size = --this[kSize];
    // 为了不让数组前面元素出现空洞，所以我们用最后一个元素覆盖pos位置的值，最后一个元素位置设置undefined
    heap[pos] = heap[size + 1];
    heap[size + 1] = undefined;

    if (size > 0 && pos <= size) {
      const compare = this[kCompare];
      if (pos > 1 && compare(heap[(pos / 2) | 0], heap[pos]) > 0) {
        // parent > 子元素
        this.percolateUp(pos);
      } else {
        // 否则向下调整
        this.percolateDown(pos);
      }
    }
  }
  // 向下调整
  percolateDown(pos) {
    const heap = this[kHeap];

    const compare = this[kCompare];
    const size = this[kSize];
    const setPosition = this[kSetPosition];
    const item = heap[pos];

    while (pos * 2 <= size) {
      let childIndex = pos * 2 + 1;

      if (childIndex > size || compare(heap[pos * 2], heap[childIndex]) < 0) {
        childIndex = pos * 2;
      }

      const child = heap[childIndex];
      if (compare(item, child) <= 0) {
        // 父<子
        break;
      }
      setPosition(child, pos);
      heap[pos] = child;
      pos = childIndex;
    }
    heap[pos] = item;
    setPosition(parent, pos);
  }
};
