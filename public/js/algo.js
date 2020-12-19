let touchedNodes = [];
let sleepTime = 100;
const fConstant = 1;
let report = document.getElementById("report");
async function BFSSearch() {
    console.log("IN bfs search");
    const graph = getGraph();
    let sourceNode = graph.sourceNode;
    let destNode = graph.destNode;
    const q = new Queue();
    let pathFound = await bfs(q, sourceNode, destNode);
    if(pathFound == null) {
        alert("not found");
        return;
    }
    report.innerText = "Total nodes checked " + touchedNodes.length;
    let temp = pathFound;
    while (temp.parent != null) {
        await sleep(50)
        var meX = temp.visualBlock.attrs.x;
        var meY = temp.visualBlock.attrs.y;

        var parentX = temp.parent.visualBlock.attrs.x;
        var parentY = temp.parent.visualBlock.attrs.y;

        var offset = parseInt(BLOCK_DIMEN / 2);

        //paper.path( ["M", meX + offset, meY+offset, "L", parentX+offset, parentY + offset] );
        //paper.line(meX, meY, parentX, parentY);
        //console.log(temp.visualBlock.attrs.x);
        colorMeFound(temp);
        temp = temp.parent;
    }
}


async function bfs(q, sourceNode, destNode) {
    // list of nodes that were changed by previous algorithm

    q.enqueue(sourceNode);
    sourceNode.visited = true;
    sourceNode.parent = null;
    
    while(!q.isEmpty()) {
        let node = q.dequeue();
        let neighbours = node.edgeList;
        for(let i = 0; i < neighbours.length; i++) {
            let next = neighbours[i].dest;
            //console.log(neighbours[i])
            if(!next.visited) {
                await sleep(100);
                touchedNodes.push(next);
                colorMeBlue(next); // equivalent of printing the node value.        
                next.visited = true;
                next.parent = node;
                if(next === destNode) {
                    return next;
                }
                q.enqueue(next);                
            }
        }
        //console.log(touchedNodes);
    }

    return null;
}


async function dfsSearch() {
    console.log("in dfs")
    const graph = getGraph();
    const sourceNode = graph.sourceNode;
    const destNode = graph.destNode;

    const stack = new Stack();
    let foundNode = await dfs(stack, sourceNode, destNode);

    if (foundNode === null) {
        alert("Not found");
        return;
    }
    report.innerText = "Total nodes checked " + touchedNodes.length;
    let temp = foundNode;
    
    while (temp !== null) {
        //console.log(temp);
        await sleep(50)

        colorMeFound(temp);
        temp = temp.parent;
    }
}

async function dfs(stack, sourceNode, destNode) {
    stack.push(sourceNode);
    sourceNode.visited = true;
    sourceNode.parent = null;
    while (!stack.isEmpty()) {

        let node = stack.pop();
        let neighbours = node.edgeList;
        for (let i = 0; i < neighbours.length; i++) {
            let next = neighbours[i].dest;
            if (!next.visited) {
                await sleep(100);
                touchedNodes.push(next);
                colorMeBlue(next);
                next.visited = true;
                next.parent = node;
                if (next === destNode) {
                    return next;
                }
                stack.push(next);
            }
        }
    } 

    return null;
}


async function dijkstraSearch() {
    console.log("in dijkstra search");
    const graph = getGraph();
    const sourceNode = graph.sourceNode;
    const destNode = graph.destNode;
    sourceNode.cost = 0;
    
    let priorityQueue = new PriorityQueue();


    let foundNode = await dijkstra(priorityQueue, sourceNode, destNode);
    if (foundNode === null) {
        alert("Not found");
    }
    report.innerText = "Total nodes checked " + touchedNodes.length;
    let temp = foundNode;
    while (temp.parent != null) {
        await sleep(50)
        colorMeFound(temp);
        temp = temp.parent;
    }
}

async function dijkstra(priorityQueue, sourceNode, destNode) {
    priorityQueue.enqueue(sourceNode);

    while (!priorityQueue.isEmpty()) {
        let currentNode = priorityQueue.dequeue();
        currentNode.visited = true;
        let neighbours = currentNode.edgeList;
        for (let i = 0; i < neighbours.length; i++) {
            let next = neighbours[i].dest;
            let edgeWeight = neighbours[i].weight; 
            console.log({ edgeWeight });
            if (!next.visited) {
                await sleep(100);
                touchedNodes.push(next);
                colorMeBlue(next);
                next.visited = true;
                next.parent = currentNode;
                next.cost = ((edgeWeight + currentNode.cost) < next.cost) ? (edgeWeight + currentNode.cost) : next.cost;
                console.log(next.cost)
                priorityQueue.enqueue(next);
                if(next === destNode) {
                    return next;
                }
            }
        }
    }

    return null;
}


async function aStarSearch() {
    const graph = getGraph();
    let sourceNode = graph.sourceNode;
    let destNode = graph.destNode;

    sourceNode.setFValue(destNode, 0);
    let openList = new Queue();
    let closedList = new Queue();
    openList.enqueue(sourceNode);
    let foundNode = await aStar(sourceNode, openList, closedList, destNode, 0);
    if(foundNode === null) {
        alert("Not Found")
        return;
    }
    report.innerText = "Total nodes checked " + touchedNodes.length;


    while (!closedList.isEmpty() && foundNode !== sourceNode) {
        colorMeFound(foundNode);
        foundNode = foundNode.parent;
        await sleep(10);
    }

}

async function aStar(parent, openList, closeList, destNode, iterCount) {
    let bestNode = openList.getBestNode();


    if(bestNode  === destNode) {
        console.log("Goal found");
        return destNode;
    }

    if(iterCount > 1000 ) {
        return null;
    }
    if(!openList.contains(bestNode) && !closeList.contains(bestNode)){
        touchedNodes.push(bestNode);
        colorMeBlue(bestNode);
        await sleep(sleepTime-50);
        closeList.enqueue(bestNode);
    }

    let neighbours = bestNode.edgeList;
    for(let i = 0; i < neighbours.length; i++) {
        let neighbourNode = neighbours[i].dest;

        if(!openList.contains(neighbourNode) && !closeList.contains(neighbourNode)){
            neighbourNode.parent = bestNode;
            //let edgeWeight = neighbourNode.weight;
            neighbourNode.setFValue(destNode, neighbourNode.parent.f + fConstant);
            openList.enqueue(neighbourNode);
            //if(neighbourNode === destNode) return  neighbourNode;
        }
    }
    return await aStar(bestNode, openList, closeList, destNode, (iterCount+1));
}





function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function colorMeFound(node) {
    if (node.visualBlock.meta.blockType === BlockType.WEIGHTED || node.visualBlock.meta.blockType === BlockType.NORMAL) {
        var anim = Raphael.animation( { 
            0.25: {transform: "s1.15", fill: BLACK}, 
            0.5: { transform: "s1.10", fill: BLACK }, 
            0.75: { transform: 's1.05', fill: BLACK  }, 
            1: { transform: 's1'} 
          }, 300 );
        node.visualBlock.toFront();
        node.visualBlock.animate(anim);    
    };
}


function getTouchedNodes() {
    return touchedNodes;
}

function resetTouchedNode() {
    touchedNodes = [];
}


function test() {
    let stack = new Stack();
    stack.push(1);
    stack.push(2);
    stack.push(3);
    stack.push(4);
    console.log(stack.data);
    console.log(stack.pop());
    console.log(stack.data);
}