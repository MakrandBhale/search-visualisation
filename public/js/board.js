const universe = document.getElementById('universe');
var paper = new Raphael(universe, window.innerWidth, window.innerHeight); //option (b)
const BLOCK_DIMEN = 50;
var blocks = paper.set();
var mouseDown = false;
var pickingSourceNode = false;
var pickingDestNode = false;
const BlockType = Object.freeze({"SOURCE":1, "DEST":2, "NORMAL":3, "WALL": 4});
var blockMatrix = [];
const GREEN_PRIMARY = "#308355";
const GREEN_SECONDARY = "#96ffb3"
const GREEN_LIGHT = "#c9ffd8"
const GRAY = "#808080";

window.onload = function() {
    // var paper = new Raphael(document.getElementById('canvas_container'), 500, 500);
    //var circle = paper.circle(100, 100, 80);
    drawBoard();

}

function drawBoard() {
    var totalCols = window.innerWidth/BLOCK_DIMEN;
    var totalRows = window.innerHeight/BLOCK_DIMEN;

    var centerRow = parseInt(totalRows / 2);
    var sourceIndex = [centerRow, 3];
    var destIndex = [centerRow, parseInt(totalCols - 3)];

    var row = 0;
    for(var i = 0; i < totalRows; i++) {
        var col = 0;
        var rowArray = new Array();
        for(var j = 0; j < totalCols; j++) {
            var block = makeNormalBlock(row, col, j, i);
            rowArray.push(block);
            col = col + BLOCK_DIMEN;
        }
        blockMatrix.push(rowArray);
        row = row + BLOCK_DIMEN;
    }

    setSourceDest(sourceIndex, destIndex);
}

function setSourceDest(sourceIndex, destIndex) {

    let sourceNode = blockMatrix[sourceIndex[0]][sourceIndex[1]];
    let destNode = blockMatrix[destIndex[0]][destIndex[1]];
    console.log(destIndex);
    makeSourceNode(sourceNode);
    makeDestNode(destNode);
}

function makeSourceNode(ref) {
    //if (!pickingSourceNode) return;
    ref.meta.setBlockType(BlockType.SOURCE);
    var anim = getScaleAnimation(GREEN_PRIMARY, GREEN_PRIMARY);
    ref.toFront();
    ref.animate(anim);
}

function makeDestNode(ref) {
    //if (!pickingDestNode) return;
    ref.meta.setBlockType(BlockType.DEST);
    var anim = getScaleAnimation('red', 'red');
    ref.toFront();
    ref.animate(anim);
}

function makeNormalAgain(ref) {
    ref.meta.setBlockType(BlockType.NORMAL);
    var anim = getScaleAnimation('white', 'white');
    ref.toFront();
    ref.animate(anim);
}


function makeWall(ref) {
    if(ref.meta.isSpecialBlock) return;
    
    ref.meta.setBlockType(BlockType.WALL);
    if(mouseDown){
        var anim = getScaleAnimation(GRAY, GRAY);
        ref.toFront();
        ref.animate(anim);
    }
}

class MetaInfo {
    constructor(blockType, col, row) {
        this.blockType = blockType;
        this.col = col;
        this.row = row;
        this.isSpecialBlock = false;
        if(blockType !== BlockType.NORMAL) {
            this.isSpecialBlock = true;
        }
    }

    setBlockType(blockType) {
        this.blockType = blockType;
        if(blockType !== BlockType.NORMAL) {
            this.isSpecialBlock = true;
        } else {
            this.isSpecialBlock = false;
        }
    }
}

function makeNormalBlock(row, col, x, y) {
    var block = paper.rect(col, row, BLOCK_DIMEN, BLOCK_DIMEN).attr({
        fill: "white", 
        stroke: "#000",
        "stroke-width": 1,
        "stroke-opacity": 0.2
    });
    
    var meta = new MetaInfo(BlockType.NORMAL, x, y);

    block.meta = meta;

    var hoverIn = function(ele){
        if (!mouseDown) return;
        if (block.meta.blockType !== BlockType.NORMAL) return; // dont override wall blocks
        
        if (pickingSourceNode) {
            
            makeSourceNode(this);
        } else if (pickingDestNode) {
            makeDestNode(this);
        } else {
            makeWall(this);
        }
    };

    var hoverOut = function (ele) {
        if (block.meta.blockType === BlockType.SOURCE && pickingSourceNode) {
            makeNormalAgain(this);
        }

        if (block.meta.blockType === BlockType.DEST && pickingDestNode) {
            makeNormalAgain(this);
        }
    }

    block.hover(hoverIn, hoverOut);
    block.mousedown(function(event) {
        mouseDown = true;

        if (block.meta.isSpecialBlock) {
            if (block.meta.blockType === BlockType.WALL) {
                makeNormalAgain(this);
            } else if (block.meta.blockType === BlockType.SOURCE) {
                pickingSourceNode = true;
                makeNormalAgain(this);
            } else if (block.meta.blockType === BlockType.DEST) {
                pickingDestNode = true;
                makeNormalAgain(this);
            }
            return;
        }
        if(pickingSourceNode) {
            makeSourceNode(this);
        } else if(pickingDestNode) {
            makeDestNode(this);
        } else {
            makeWall(this);
        }        
    });

    block.mouseup(function (event) {
        mouseDown = false;
        if (pickingSourceNode) {
            makeSourceNode(this);
            pickingSourceNode = false;
        }

        if (pickingDestNode) {
            makeDestNode(this);
            pickingDestNode = false;
        }
         //console.log(mouseDown)
    });

    blocks.push(block);
    return block;
}





function pickSourceNode() {
    console.log("hello")
    pickingSourceNode = true;
}


function resize() {
    paper.setSize(window.innerHeight, window.innerWidth);
    drawBoard();
}

window.addEventListener('resize', ()=> {
    resize();
} )

function pickDestNode() {
    pickingDestNode = true;
}

function getMatrix() {
    return blockMatrix;
}

function redraw() {
    blockMatrix = [];
    drawBoard();
    resetTouchedNode();
}

function getScaleAnimation (lightColor, darkColor) {
    return Raphael.animation( { 
        0.25: {transform: "s1.2", fill: darkColor}, 
        0.5: { transform: "s1.15", fill: lightColor }, 
        0.75: { transform: 's1.1', fill: lightColor  }, 
        1: { transform: 's1'} 
      }, 300 );

    
}


function start() {
    createGraph();

    let touchedNodes = getTouchedNodes();
    if (touchedNodes != null && touchedNodes.length > 0) {
        for (let i = 0; i < touchedNodes.length; i++) {
            if(touchedNodes[i].visualBlock.meta.blockType === BlockType.NORMAL)
                makeNormalAgain(touchedNodes[i].visualBlock);
        }
    }

    resetTouchedNode();
    const SearchAlgoType = Object.freeze({ "BFS": 0, "A_STAR": 1, "DIJKSTRA": 2, "DFS": 3 });
    
    const selectedVal = document.getElementById("algos").selectedIndex;
    console.log(selectedVal);
    console.log(selectedVal == SearchAlgoType.BFS);
    switch (parseInt(selectedVal)) {
        case SearchAlgoType.BFS:
            console.log("in case");
            BFSSearch();
            break;
        case SearchAlgoType.A_STAR:
            aStarSearch();
            break;
        case SearchAlgoType.DIJKSTRA:
            dijkstraSearch();
            break;
        case SearchAlgoType.DFS:
            dfsSearch();
            break;
        default:
            console.log(selectedVal === SearchAlgoType.BFS);

            break;
    }

}