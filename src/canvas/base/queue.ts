class Queue {
  queue: any[];
  constructor() {
    this.queue = [];
  }
  enqueue(element: any) {
    this.queue.push(element);
  }
  dequeue() {
    return this.queue.shift();
  }
}

export default Queue;