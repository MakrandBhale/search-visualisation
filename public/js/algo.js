let touchedNodes = [];


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

    let temp = pathFound;
    while (temp != null) {
        await sleep(100)
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
            let next = neighbours[i];
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

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function colorMeFound(node) {
    if(node.visualBlock.meta.blockType !== BlockType.NORMAL) return;

    //console.log("found node");
    var anim = Raphael.animation( { 
        0.25: {transform: "s1.15", fill: 'black'}, 
        0.5: { transform: "s1.10", fill: 'black' }, 
        0.75: { transform: 's1.05', fill: 'black'  }, 
        1: { transform: 's1'} 
      }, 300 );
    node.visualBlock.toFront();
    node.visualBlock.animate(anim);

}


function getTouchedNodes() {
    return touchedNodes;
}

function resetTouchedNode() {
    touchedNodes = [];
}


function test() {

}