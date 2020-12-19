class Queue {
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
    enqueue(item) {
      this.data.push(item);
    }
    // removing element from the queue 
    // returns underflow when called  
    // on empty queue 


    getBestNode() {
        let i = 0;
        let minIndex = 0;
        let minValue = 999999;
        for(i = 0 ; i < this.data.length; i++) {
            if(this.data[i].f < minValue) {
                minIndex = i;
                minValue = this.data[i].f;
            }
        }
        let bestNode= this.data[minIndex];
        this.data.splice(minIndex, 1);
        return bestNode;
    }
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


    contains(node) {
        let i;
        for (i = 0; i < this.data.length; i++) {
            if (this.data[i] === node) {
                return true;
            }
        }
        return false;
    }

}