class Stack {
    constructor() {
        this.data = [];
    }

    push(node) {
        this.data.push(node);
    }

    pop() {
        if (this.data.length === 0)
            return;
        return this.data.pop();
    }

    peek() {
        if (this.data.length === 0)
            return;
        return this.data[this.data.length - 1];
    }

    isEmpty() {
        return this.data.length === 0;
    }
}