const kCompare = Symbol("compare");
const kHeap = Symbol("heap");
const kSetPosition = Symbol("setPosition");
const kSize = Symbol("size");

// 基础的二进制堆
class PriorityQueue {
  constructor(comparator, setPosition) {
    this[kCompare] = comparator;
    this[kSetPosition] = setPosition;
    this[kHeap] = new Array(64);
    this[kSize] = 0;
  }

  [kCompare](a, b) {
    return a - b;
  }

  peek() {
    return this[kHeap][1];
  }

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
      const parent = heap[(pos / 2) | 0];
      // 父节点小于子节点，停止
      if (compare(parent, item) <= 0) {
        break;
      }
      // 否则交换父节点与子节点位置
      heap[pos] = parent;
      setPosition(parent, pos);
      pos = (pos / 2) | 0;
    }
    heap[pos] = item;
    setPosition(item, pos);
  }

  // 向下调整
  removeAt(pos) {}

  // 向下调整
  percolateDown(pos) {
    const compare = this[kCompare];
  }
}
