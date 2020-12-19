const constantWeight = 1;
const initialCost = 999999;
class Graph {
    constructor() {
        this.nodes = [];
    }
    addNode(node) {
        this.nodes.push(node);
    }

    createSourceNode(node) {
        this.sourceNode= node;
    }

    createDestNode(node) {
        this.destNode = node;
    }
}

let graph;

class Edge {
    constructor(source, dest, weight) {
        this.source = source;
        this.dest = dest;
        if (weight === undefined)
            this.weight = constantWeight;
        else
            this.weight = weight;
    }

    setWeight(weight) {
        this.weight = weight;
    }

    getWeight() {
        return this.weight;
    }
}

class Node {
    constructor(visualBlock, row, col) {
        this.visualBlock = visualBlock;
        this.row = row;
        this.col = col;
        this.edgeList = [];
        this.visited = false;
        if (visualBlock.blockType === BlockType.SOURCE)
            this.cost = 0;
        else
            this.cost = initialCost;
    }

    setFValue(destNode, parentF) {
        this.heuristicValue = this.calculateManhattanDistance(this, destNode);
        this.f =  this.heuristicValue + parentF;
    }

    calculateEucledianDistance(currentNode, destNode) {
        let x1 = currentNode.col;
        let y1 = currentNode.row;

        let x2 = destNode.col;
        let y2 = destNode.row;

        return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
    }

    calculateManhattanDistance(currentNode, destNode) {
        let x1 = currentNode.col;
        let y1 = currentNode.row;

        let x2 = destNode.col;
        let y2 = destNode.row;

        return(Math.abs(x1 - x2) + Math.abs(y1 - y2));
    }
    addEdge(node, weight) {
         
        var edge = new Edge(this, node, weight);

        if(node.visualBlock.meta.blockType != BlockType.WALL) {
            this.edgeList.push(edge);
        }
    }


}


function createGraph() {
    const blockMatrix = getMatrix();
    graph = new Graph();

    for(var i = 0; i < blockMatrix.length; i++) {
        var rowArray = [];
        for(var j = 0; j < blockMatrix[0].length; j++) {
            var visualBlock = blockMatrix[i][j];
            var row = visualBlock.meta.row;
            var col = visualBlock.meta.col;
            var blockType = visualBlock.meta.blockType;
            var node = new Node(visualBlock, row, col);
            rowArray.push(node);
            
            if(blockType === BlockType.SOURCE) {
                graph.createSourceNode(node);
            } else if(blockType === BlockType.DEST) {
                graph.createDestNode(node);
            } 
        }
        graph.nodes.push(rowArray);
    }
    
    console.log("Created Nodes");
    prepEdges();
}


function prepEdges() {
    for (let i = 0; i < graph.nodes.length; i++) {
        for(let j = 0; j < graph.nodes[0].length; j++) {
            let node = graph.nodes[i][j];
            let topIndex = [node.row - 1, node.col];
            let leftIndex = [node.row, node.col - 1];
            let bottomIndex = [node.row + 1, node.col];
            let rightIndex = [node.row, node.col + 1]
            
            attemptToAddEdge(topIndex, node);
            attemptToAddEdge(leftIndex, node);
            attemptToAddEdge(rightIndex, node);
            attemptToAddEdge(bottomIndex, node);
            
            
        }        
    }
    console.log("Edges prepped");
    //console.log(graph.sourceNode.edgeList);
}


function attemptToAddEdge(indexArr, node) {
    if(!isWithinBounds(indexArr)) return;
    //console.log(indexArr)
    
    let neighbourNode = graph.nodes[indexArr[0]][indexArr[1]];
    //console.log(neighbourNode)
    if (neighbourNode.visualBlock.meta.blockType === BlockType.WEIGHTED) {
        node.addEdge(neighbourNode, parseInt(neighbourNode.visualBlock.meta.customWeight));    
        return;
    }
    node.addEdge(neighbourNode, parseInt(node.visualBlock.meta.customWeight));
}

function isWithinBounds(bound) {
    const maxWidth = graph.nodes[0].length;
    const maxHeight = graph.nodes.length;
    let row = bound[0], col = bound[1];

    if(row > maxHeight - 1 || row < 0) {
        return false;
    } 

    if(col > maxWidth - 1 || col < 0) {
        return false; 
    }

    return true;
}

function pause() {
    sourceNode = graph.sourceNode;
    test(sourceNode);
}

function test(node) {
    for(let i = 0; i < node.edgeList.length; i++) {
        if(node.edgeList[i].dest.visited) continue;
        
        node.edgeList[i].dest.visited = true;
        colorMeBlue(node.edgeList[i]);

        setTimeout(function() {
            test(node.edgeList[i].dest);
        }, 300);
        
    }
    
}



function colorMeBlue(node) {
    if(node.visualBlock.meta.blockType !== BlockType.NORMAL) return;

    
    var anim = Raphael.animation( { 
        0.25: {transform: "s1.15", fill: SECONDARY_COLOR}, 
        0.5: { transform: "s1.10", fill:  PRIMARY_LIGHT}, 
        0.75: { transform: 's1.05', fill:  PRIMARY_LIGHT }, 
        1: { transform: 's1'} 
      }, 300 );
    node.visualBlock.toFront();
    node.visualBlock.animate(anim);

}

function getGraph() {
    return graph;
}