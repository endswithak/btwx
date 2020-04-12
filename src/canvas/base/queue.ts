class Queue {
  queue: any[];
  constructor() {
    this.queue = [];
  }
  enqueue(element: any) {
    this.queue.push(element);
  }
  dequeue() {
    // if (this.isEmpty()) {
    //   return 'Queue is empty';
    // } else {
    //   return this.queue.shift();
    // }
    return this.queue.shift();
  }
  peek() {
    if (this.isEmpty()) {
      return 'Queue is empty';
    } else {
      return this.queue[0];
    }
  }
  isEmpty() {
    return !this.queue.length;
  }
}

export default Queue;