class PriorityQueue {
    constructor() {
      // Array is used to implement a Queue
      this.data = [];
    }
  
    // Functions to be implemented 
    // enqueue(item) 
    // dequeue() 
    // front() 
    // isEmpty() 
  
    // Adds an element to the queue
    enqueue(node) {
        let i = 0;
        for (i = 0; i < this.data.length; i++) {
            if (node.cost < this.data[i].cost) {
                break;
            }
        }
        this.data.splice(i, 0, node);
    }
    // removing element from the queue 
    // returns underflow when called  
    // on empty queue





    dequeue() {
      if (this.isEmpty()) {
        return;
      }
      return this.data.shift();
    }
  
    // front function 
    front() {
      // returns the Front element of  
      // the queue without removing it. 
      if (this.isEmpty())
        return;
      return this.data[0];
    }
  
    // isEmpty function 
    isEmpty() {
      // return true if the queue is empty. 
      return this.data.length === 0;
    }
  }